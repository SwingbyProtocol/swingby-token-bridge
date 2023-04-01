import {
  Button,
  createOrUpdateToast,
  dismissToast,
  getCryptoAssetFormatter,
  Loading,
  TextInput,
} from '@swingby-protocol/pulsar';
import { Big } from 'big.js';
import { ChangeEventHandler, useCallback, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useSupplyQuery } from '../../generated/graphql';
import { isTransactionHistoryEnabled } from '../../modules/env';
import { logger } from '../../modules/logger';
import { useOnboard } from '../../modules/onboard';
import { useAssertTermsSignature } from '../../modules/terms';
import { getDestinationNetwork, getSwingbyBalance, transferToHotWallet } from '../../modules/web3';

import {
  AmountContainer,
  ButtonsContainer,
  Container,
  FeeContainer,
  Guideline,
  MaxButton,
  RowTutorial,
  StyledCard,
  StyledConnectWallet,
  StyledSupplyInfo,
  TitleGuideline,
} from './styled';
import { TransactionHistory } from './TransactionHistory';
import { useCheckSanityEffect } from './useCheckSanityEffect';
import { useSwapFee } from './useSwapFee';

const SWAP_ENABLED = false;
const TOAST_ID_GET_MAX = 'get-max';

logger.debug({ isTransactionHistoryEnabled }, 'Is the transaction history feature enabled?');

export const HomePage = () => {
  const { address, network, onboard } = useOnboard();
  const [amount, setAmount] = useState('');
  const [gettingMax, setGettingMax] = useState(false);
  const [transferring, setTrasferring] = useState(false);
  const { data: feeData, node: feeNode } = useSwapFee();
  const { isOk: isSanityCheckOk } = useCheckSanityEffect();
  const { assertTermsSignature } = useAssertTermsSignature();
  const { locale } = useIntl();
  const { data } = useSupplyQuery({ pollInterval: 60000 });
  const hotWalletBalance =
    data && network ? (network === 1 ? data.bscBalance : data.ethereumBalance) : 0;

  const parsedAmount = useMemo(() => {
    try {
      return new Big(amount);
    } catch (e) {
      return null;
    }
  }, [amount]);

  const amountChanged = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (evt) => setAmount(evt.target.value),
    [],
  );

  const getMax = useCallback(async () => {
    try {
      setGettingMax(true);
      setAmount(await getSwingbyBalance({ onboard }));
      dismissToast({ toastId: TOAST_ID_GET_MAX });
    } catch (err) {
      logger.debug({ err }, 'Failed to get balance');
      createOrUpdateToast({
        content: 'Failed to get balance',
        type: 'danger',
        toastId: TOAST_ID_GET_MAX,
      });
    } finally {
      setGettingMax(false);
    }
  }, [onboard]);

  const transfer = useCallback(async () => {
    if (!parsedAmount) return;
    try {
      setTrasferring(true);
      await assertTermsSignature();
      await transferToHotWallet({ amount: parsedAmount, onboard });
    } catch (err) {
    } finally {
      setTrasferring(false);
    }
  }, [onboard, parsedAmount, assertTermsSignature]);

  const minAmount = feeData && Number(feeData.minimumSwapSwingby);
  const minAmountRound = minAmount && Math.ceil(minAmount / 1000) * 1000;

  return (
    <Container>
      <StyledConnectWallet />
      <StyledSupplyInfo />
      <StyledCard size="town">
        <AmountContainer>
          <TextInput size="state" value={amount} onChange={amountChanged} placeholder="0" />
          <MaxButton
            variant="secondary"
            size="street"
            shape="fit"
            disabled={!address || !network || gettingMax}
            onClick={getMax}
          >
            {gettingMax ? <Loading /> : <FormattedMessage id="form.max-btn" />}
          </MaxButton>
        </AmountContainer>
        <FeeContainer>
          <div>
            {minAmountRound && (
              <FormattedMessage
                id="form.swap-fee.min-swingby"
                values={{
                  swingby: getCryptoAssetFormatter({
                    locale,
                    displaySymbol: 'SWINGBY',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(minAmountRound),
                }}
              />
            )}
          </div>
          <div>{feeNode}</div>
        </FeeContainer>
        <ButtonsContainer>
          <div />
          <Button
            variant="primary"
            size="state"
            disabled={
              !SWAP_ENABLED ||
              !isSanityCheckOk ||
              !address ||
              !network ||
              !parsedAmount?.gt(0) ||
              transferring ||
              !feeData ||
              parsedAmount.lt(String(minAmountRound)) ||
              Number(amount) > Number(hotWalletBalance)
            }
            onClick={transfer}
          >
            {(() => {
              if (!SWAP_ENABLED) {
                return 'Temporarily Offline';
              }

              if (transferring) {
                return <Loading />;
              }

              if (network) {
                return (
                  <FormattedMessage
                    id="form.swap-to-btn"
                    values={{
                      network: (
                        <FormattedMessage
                          id={
                            network === 56
                              ? `network.full.${getDestinationNetwork(network)}`
                              : `network.short.${getDestinationNetwork(network)}`
                          }
                        />
                      ),
                    }}
                  />
                );
              }

              return <FormattedMessage id="form.swap-btn" />;
            })()}
          </Button>
        </ButtonsContainer>
        <Guideline>
          <TitleGuideline>
            <FormattedMessage id="form.guideline-title" />
          </TitleGuideline>
          <RowTutorial>
            <span>
              <FormattedMessage id="form.guideline-step-1" />
            </span>
            <a
              href="https://community.trustwallet.com/t/how-to-make-a-crosschain-swap-on-trust-wallet/85522"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FormattedMessage id="form.guideline-see-tutorial" />
            </a>
          </RowTutorial>
          <span>
            <FormattedMessage id="form.guideline-step-2" />
          </span>
          <span>
            <FormattedMessage id="form.guideline-step-3" />
          </span>
        </Guideline>
        {/* <SwapToBep2 amount={parsedAmount} /> */}
      </StyledCard>
      {!!address && !!network && isTransactionHistoryEnabled && <TransactionHistory />}
    </Container>
  );
};
