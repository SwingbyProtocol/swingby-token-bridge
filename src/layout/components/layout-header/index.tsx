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
      <Tittle>Swingby Token Bridge (ETH ⇄ BSC)</Tittle>
    </Header>
  );
};

export default LayoutHeader;
