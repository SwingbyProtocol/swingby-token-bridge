import { FormattedMessage } from 'react-intl';

import { isValidNetworkId, NetworkId } from '../../modules/onboard';

import { Container } from './styled';

export function NetworkTag(props: { network: number | null; className?: string }): JSX.Element;
export function NetworkTag(props: { network: NetworkId | null; className?: string }): JSX.Element;
export function NetworkTag({
  network,
  className,
}: {
  network: NetworkId | number | null;
  className?: string;
}): JSX.Element {
  return (
    <Container value={isValidNetworkId(network) ? network : null} className={className}>
      {isValidNetworkId(network) ? <FormattedMessage id={`network.short.${network}`} /> : '?'}
    </Container>
  );
}
