import { PrismaClient } from '@prisma/client';
import Web3 from 'web3';

const web3 = new Web3();
const prisma = new PrismaClient();

const LIQUIDITY_PROVIDERS = [
  '0xDb7D5009D7c594c527227d481e122d821923c673',
  '0x656fb120760d3CD0BD15ca8296a432e3fe07d56b',
  '0x219b35ff0528fe11e55f68f9a63e0b1392b0a299',
];

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
