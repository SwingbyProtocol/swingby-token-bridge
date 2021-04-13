import { Icon } from '@swingby-protocol/pulsar';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { useWallet } from '../../useWallet';
import { useInternalContext } from '../../internal-context';

import { WalletType } from './WalletType';
import { ChainSelector } from './ChainSelector';
import { WalletConnect } from './WalletConnect';
import { WalletSelector } from './WalletSelector';
import { BackButton, Title, TitleIcon } from './styled';

type Props = { onClose?: () => void };

export const Content = ({ onClose }: Props) => {
  const { onboard } = useInternalContext();
  const { address } = useWallet();
  const [chainPicked, setChainPicked] = useState(false);
  const [walletType, setWalletType] = useState<WalletType>(null);

  useEffect(() => {
    if (address) {
      onClose?.();
    }
  }, [address, onClose]);

  return (
    <>
      <Title>
        {walletType ? (
          <BackButton
            onClick={(evt) => {
              evt.preventDefault();
              evt.stopPropagation();
              setWalletType(null);
            }}
          >
            <Icon.ArrowLeft />
          </BackButton>
        ) : chainPicked ? (
          <BackButton
            onClick={(evt) => {
              evt.preventDefault();
              evt.stopPropagation();
              setChainPicked(false);
            }}
          >
            <Icon.ArrowLeft />
          </BackButton>
        ) : (
          <TitleIcon>
            <Icon.Wallet />
          </TitleIcon>
        )}
        &nbsp;
        {chainPicked ? (
          <FormattedMessage id={`bc-wallet.select-a-wallet.${walletType}.title`} />
        ) : (
          <FormattedMessage id="use-wallet.select-chain.title" />
        )}
      </Title>

      {(() => {
        if (!chainPicked) {
          return (
            <ChainSelector
              onSelection={(chain) => {
                if (chain === 'binance-chain') {
                  setChainPicked(true);
                  return;
                }

                onboard.instance?.walletSelect();
                onClose?.();
              }}
            />
          );
        }

        switch (walletType) {
          case 'wallet-connect':
            return <WalletConnect />;
          case 'binance-chain-wallet':
            return <>Binance Chain Wallet</>;
          default:
            return <WalletSelector onSelection={setWalletType} />;
        }
      })()}
    </>
  );
};
