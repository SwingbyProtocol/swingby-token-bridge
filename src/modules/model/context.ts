import type { PrismaClient } from '@prisma/client';

export type MyContextType = {
  prisma: PrismaClient;
};
