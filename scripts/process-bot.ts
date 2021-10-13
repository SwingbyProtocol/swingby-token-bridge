import { Duration } from 'luxon';

import { fetcher } from '../src/modules/fetch';
import { logger } from '../src/modules/logger';

const NETWORKS = ['ethereum', 'goerli', 'bsc', 'bsct'];
const TASKS = ['deposits', 'failed-payments', 'payments', 'pending-payments'];
const GENERIC_TASKS = ['team-wallet-balances'];

const REPEAT_INTERVAL = Duration.fromObject({ seconds: 30 }).as('milliseconds');
const TIMEOUT_AFTER = Duration.fromObject({ minutes: 1.5 }).as('milliseconds');

NETWORKS.forEach((network) => {
  TASKS.forEach((task) => {
    (async () => {
      const generator = runNetworkTask(network, task);
      for await (let value of generator) {
        logger.info(value, 'Got result for %j/%j', network, task);
      }
    })();
  });
});

GENERIC_TASKS.forEach((task) => {
  (async () => {
    const generator = runGenericTask(task);
    for await (let value of generator) {
      logger.info(value, 'Got result for generic task %j', task);
    }
  })();
});

async function* runNetworkTask(network: typeof NETWORKS[number], task: typeof TASKS[number]) {
  for (;;) {
    try {
      const controller = new AbortController();

      const id = setTimeout(() => controller.abort(), TIMEOUT_AFTER);
      const result = await fetcher<Record<string, any>>(
        `${process.env.BASE_URL}/api/v1/process/${network}/${task}`,
        { signal: controller.signal },
      );
      clearTimeout(id);

      yield { network, task, result };
    } catch (e) {
      yield { network, task, err: e as Error };
    }

    await new Promise((resolve) => setTimeout(resolve, REPEAT_INTERVAL));
  }
}

async function* runGenericTask(task: typeof GENERIC_TASKS[number]) {
  for (;;) {
    try {
      const controller = new AbortController();

      const id = setTimeout(() => controller.abort(), TIMEOUT_AFTER);
      const result = await fetcher<Record<string, any>>(
        `${process.env.BASE_URL}/api/v1/process/${task}`,
        { signal: controller.signal },
      );
      clearTimeout(id);

      yield { task, result };
    } catch (e) {
      yield { task, err: e as Error };
    }

    await new Promise((resolve) => setTimeout(resolve, REPEAT_INTERVAL));
  }
}
