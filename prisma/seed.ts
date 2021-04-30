import { PrismaClient } from '@prisma/client';
import Web3 from 'web3';

const web3 = new Web3();
const prisma = new PrismaClient();

const LIQUIDITY_PROVIDERS = ['0xDb7D5009D7c594c527227d481e122d821923c673'];

async function main() {
  const liquidityProviders = await Promise.all(
    LIQUIDITY_PROVIDERS.map((address) => web3.utils.toChecksumAddress(address)).map((address) =>
      prisma.liquidityProvider.upsert({
        where: { address },
        update: { address },
        create: { address },
      }),
    ),
  );

  console.log({ liquidityProviders });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
