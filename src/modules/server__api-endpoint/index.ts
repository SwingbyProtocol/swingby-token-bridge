import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';
import { DateTime, Duration } from 'luxon';
import { LockId } from '@prisma/client';

import { corsMiddleware } from '../server__cors';
import { logger } from '../logger';
import { server__processTaskSecret, prisma } from '../server__env';
import { NetworkId } from '../onboard';
import { fromDbNetwork } from '../server__db';

const WARN_IF_SPENT_MORE_THAN = Duration.fromObject({ seconds: 30 });

export class InvalidParamError extends Error {}

export class InvalidMethodError extends Error {}

export class NotAuthenticatedError extends Error {}

export class AlreadyLockedError extends Error {}

export class LockMismatchError extends Error {}

export const getStringParam = <T extends string>({
  req,
  name,
  from,
  oneOf,
  defaultValue,
}: {
  req: NextApiRequest;
  name: string;
  from: 'query' | 'body';
  oneOf?: T[];
  defaultValue?: T;
}): T => {
  try {
    const value = req[from]?.[name];
    if (typeof value !== 'string') {
      throw new InvalidParamError(`"${name}" must be a string`);
    }

    if (oneOf && !oneOf.includes(value as any)) {
      throw new InvalidParamError(`"${name}" must be one of: ${oneOf.join(', ')}`);
    }

    return value as T;
  } catch (e) {
    if (typeof defaultValue !== 'undefined') {
      return defaultValue;
    }

    throw e;
  }
};

export const createEndpoint =
  <T extends any = any>({
    isSecret = false,
    fn,
  }: {
    isSecret?: boolean;
    fn: (params: {
      req: NextApiRequest;
      res: NextApiResponse<T>;
      network: NetworkId;
      prisma: typeof prisma;
      lock: (lockId: LockId) => Promise<void>;
      assertLockIsValid: () => Promise<void>;
    }) => void | Promise<void>;
  }) =>
  async (req: NextApiRequest, res: NextApiResponse<T>) => {
    let lockId: LockId | null = null;
    const startedAt = DateTime.utc();

    try {
      await corsMiddleware({ req, res });

      const secret = getStringParam({ req, from: 'query', name: 'secret', defaultValue: '' });
      if (isSecret && server__processTaskSecret && server__processTaskSecret !== secret) {
        throw new NotAuthenticatedError(
          'Must provide a secret key to be able to call this endpoint',
        );
      }

      await fn({
        req,
        res,
        prisma,
        get network() {
          const value = getStringParam({
            req,
            from: 'query',
            name: 'network',
            oneOf: ['ethereum', 'goerli', 'bsc', 'bsct'],
          });

          return fromDbNetwork(value.toUpperCase() as Uppercase<typeof value>);
        },
        lock: async (id: LockId) => {
          lockId = id;

          const lock = await prisma.locks.findUnique({ where: { id } });
          if (
            lock &&
            !DateTime.fromJSDate(lock.at, { zone: 'utc' }).equals(startedAt) &&
            // If the lock is too old, we want to overwrite it and create a new one.
            DateTime.utc()
              .diff(DateTime.fromJSDate(lock.at, { zone: 'utc' }))
              .as('milliseconds') < Duration.fromObject({ minutes: 30 }).as('milliseconds')
          ) {
            throw new AlreadyLockedError(`"${id}" is already locked`);
          }

          await prisma.locks.upsert({
            where: { id },
            create: { id, at: startedAt.toJSDate() },
            update: { at: startedAt.toJSDate() },
          });

          logger.info('Lock %j created', id);
        },
        assertLockIsValid: async () => {
          if (!lockId) return;

          const lock = await prisma.locks.findUnique({ where: { id: lockId } });
          if (!lock || !DateTime.fromJSDate(lock.at, { zone: 'utc' }).equals(startedAt)) {
            throw new LockMismatchError(`"${lockId}" does not belong to this process`);
          }
        },
      });
    } catch (e) {
      const message = e?.message || '';

      if (e instanceof InvalidParamError) {
        logger.trace(e);
        res.status(StatusCodes.BAD_REQUEST).json({ message } as any);
        return;
      }

      if (e instanceof InvalidParamError) {
        logger.trace(e);
        res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ message } as any);
        return;
      }

      if (e instanceof NotAuthenticatedError) {
        logger.trace(e);
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: message || 'No authentication was provided' } as any);
        return;
      }

      if (e instanceof AlreadyLockedError) {
        logger.trace(e);
        res
          .status(StatusCodes.LOCKED)
          .json({ message: message || 'This script is already being run' } as any);
        return;
      }

      if (e instanceof LockMismatchError) {
        logger.fatal(e);
        res.status(StatusCodes.LOCKED).json({ message: message || 'Lock assertion failed' } as any);
        return;
      }

      logger.error(e);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Something went wrong' } as any);
    } finally {
      try {
        if (lockId) {
          const lock = await prisma.locks.findUnique({ where: { id: lockId } });
          if (lock && DateTime.fromJSDate(lock.at, { zone: 'utc' }).equals(startedAt)) {
            logger.info('Lock %j released', lockId);
            await prisma.locks.delete({ where: { id: lockId } });
          } else {
            logger.debug(
              { lock, startedAt },
              'Lock %j *not* released since it does not belong to this execution',
              lockId,
            );
          }
        }
      } catch (e) {
        logger.fatal(e, 'Could not release DB lock');
      }

      const spent = DateTime.utc().diff(startedAt);
      const finalLogger = logger.child({ spent: spent.toObject() });

      finalLogger.info('Endpoint done!');
      if (spent.as('milliseconds') > WARN_IF_SPENT_MORE_THAN.as('milliseconds')) {
        finalLogger.warn('Took a bit long to finish');
      }
    }
  };
