import React from 'react';

import { ArrowIcon, BurgerButton, ConnectButton, Header, Tittle } from './styled';

type NavHandlerProps = {
  navOpen: boolean;
  setNavOpen: (navOpen: boolean) => void;
};

const LayoutHeader: React.FC<NavHandlerProps> = ({ navOpen, setNavOpen }) => {
  return (
    <Header>
      <BurgerButton onClick={() => setNavOpen(!navOpen)}>
        <ArrowIcon navOpen={navOpen} />
      </BurgerButton>
      <Tittle>Bridge</Tittle>
      <ConnectButton variant={'small'}>Connect</ConnectButton>
    </Header>
  );
};

export default LayoutHeader;
