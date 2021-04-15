import { FormattedMessage } from 'react-intl';

import { Container } from './styled';

export const Divider = ({ className }: { className?: string }) => {
  return (
    <Container className={className}>
      <FormattedMessage id="form.bsc-bc.divider" />
    </Container>
  );
};
