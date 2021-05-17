import { fetcher } from '../src/modules/fetch';
import { server__processTaskSecret } from '../src/modules/server__env';

const NETWORKS = ['ethereum', 'goerli', 'bsc', 'bsct'];
const TASKS = ['deposits', 'failed-payments', 'payments', 'pending-payments'];

NETWORKS.forEach((network) => {
  TASKS.forEach((task) => {
    (async () => {
      const generator = runNetworkTask(network, task);
      for await (let value of generator) {
        console.log(value);
      }
    })();
  });
});

async function* runNetworkTask(network: typeof NETWORKS[number], task: typeof TASKS[number]) {
  for (;;) {
    try {
      const result = await fetcher<Record<string, any>>(
        `https://k8s.skybridge.exchange/swingby-token-bridge/api/v1/process/${network}/${task}?secret=${server__processTaskSecret}`,
      );

      yield { network, task, result };
    } catch (e) {
      yield { network, task, error: e as Error };
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}
