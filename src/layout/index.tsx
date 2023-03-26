import React, { useState } from 'react';

import LayoutHeader from './components/layout-header';
import LayoutSideNav from './components/layout-side-nav';
import { Body, LayoutContainer, Main } from './styled';

const LayoutView: React.FC = ({ children }) => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <LayoutContainer>
      <LayoutSideNav navOpen={navOpen} setNavOpen={setNavOpen} />
      <Body>
        <LayoutHeader navOpen={navOpen} setNavOpen={setNavOpen} />
        <Main>{children}</Main>
      </Body>
    </LayoutContainer>
  );
};

export default LayoutView;
