export const logLevel =
  process.env.NEXT_PUBLIC_LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'debug' : 'trace');

export const server__processTaskSecret = process.env.PROCESS_TASK_SECRET || undefined;
