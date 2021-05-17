import { fetcher } from '../fetch';
import { server__processTaskSecret } from '../server__env';

const NETWORKS = ['ethereum', 'goerli', 'bsc', 'bsct'];
const TASKS = ['deposits', 'failed-payments', 'payments', 'pending-payments'];

(async () => {
  const generator = runTasks();
  for await (let value of generator) {
    console.log(value);
  }
})();

async function* runTasks() {
  let n = 0;
  let t = 0;

  do {
    const network = NETWORKS[n];
    const task = TASKS[t];

    try {
      const result = await fetcher<Record<string, any>>(
        `https://k8s.skybridge.exchange/swingby-token-bridge/api/v1/process/${network}/${task}?secret=${server__processTaskSecret}`,
      );

      yield { network, task, result };
    } catch (e) {
      yield { network, task, error: e as Error };
    }

    t++;

    if (t >= TASKS.length) {
      t = 0;
      n++;
    }

    if (n >= NETWORKS.length) {
      n = 0;
    }
  } while (true);
}
