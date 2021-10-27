import { useCallback, useEffect, useMemo } from 'react';
import Web3 from 'web3';

import {
  useTermsMessageQuery,
  useSignTermsMutation,
  useHasSignedTermsLazyQuery,
} from '../../generated/graphql';
import { logger } from '../logger';
import { useOnboard } from '../onboard';

export const useAssertTermsSignature = () => {
  const { wallet, address } = useOnboard();
  const { data: msgData } = useTermsMessageQuery();
  const [signTerms] = useSignTermsMutation();
  const [fetchTerms, { data }] = useHasSignedTermsLazyQuery();

  const assertTermsSignature = useCallback(async () => {
    if (!msgData) {
      throw new Error('No Terms of Service message found');
    }

    if (!wallet || !address) {
      throw new Error('No wallet connected');
    }

    if (!data) {
      throw new Error('No response for "hasSignedTerms" availabled');
    }

    if (data.hasSignedTerms) {
      return;
    }

    try {
      const message = msgData.termsMessage.message;
      const seed = msgData.termsMessage.seed;

      const web3 = new Web3(wallet.provider);
      const signature = await web3.eth.personal.sign(message, address, seed);
      await signTerms({ variables: { address, signature } });

      fetchTerms({ variables: { address } });
    } catch (err) {
      logger.error({ err }, 'Error trying to get signature');
      throw err;
    }
  }, [address, wallet, msgData, signTerms, data, fetchTerms]);

  useEffect(() => {
    if (!address) return;

    let cancelled = false;

    const refetch = () => {
      if (cancelled) return;
      fetchTerms({ variables: { address } });
      setTimeout(refetch, 30000);
    };

    refetch();

    return () => {
      cancelled = true;
    };
  }, [fetchTerms, address]);

  return useMemo(() => ({ assertTermsSignature, fetchTerms }), [assertTermsSignature, fetchTerms]);
};
