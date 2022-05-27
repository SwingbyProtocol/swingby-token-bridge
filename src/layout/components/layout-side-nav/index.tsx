import React, { useState } from 'react';

// eslint-disable-next-line import/no-internal-modules
import Icon, { IconNames } from '../commons/Icon';

import {
  Aside,
  Button,
  ButtonContainer,
  ButtonContent,
  ButtonLabel,
  CloseButton,
  LogoContainer,
  LogoLabel,
  LogoLink,
  Mask,
  Nav,
  NavLink,
  Wrapper,
} from './styled';

type NavHandlerProps = {
  navOpen: boolean;
  setNavOpen: (navOpen: boolean) => void;
};

const LayoutSideNav: React.FC<NavHandlerProps> = ({ navOpen, setNavOpen }) => {
  React.useEffect(() => {
    setNavOpen(false);
  }, [setNavOpen]);

  React.useEffect(() => {
    if (navOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [navOpen]);

  return (
    <Wrapper>
      <Mask navOpen={navOpen} onClick={() => setNavOpen(false)} />
      <Aside open={navOpen}>
        <LogoContainer>
          <CloseButton onClick={() => setNavOpen(false)}>
            <Icon name="close" />
          </CloseButton>
          <LogoLink href="https://swingby.network/">
            <Icon name="bond-square-token" />
            <LogoLabel navOpen={navOpen}>Swingby</LogoLabel>
          </LogoLink>
        </LogoContainer>
        <Nav>
          <NavLink href="https://dao.swingby.network/">
            <>
              <Icon name="bond-square-token" />
              <ButtonContent navOpen={navOpen}>
                <ButtonLabel>DAO</ButtonLabel>
              </ButtonContent>
            </>
          </NavLink>
          <NavLink href="https://swingby.network/">
            <>
              <Icon name="bond-square-token" />
              <ButtonContent navOpen={navOpen}>
                <ButtonLabel>Bridge</ButtonLabel>
              </ButtonContent>
            </>
          </NavLink>
          <NavLink href="https://skypools.swingby.network/">
            <>
              <Icon name="bond-square-token" />
              <ButtonContent navOpen={navOpen}>
                <ButtonLabel>Skypools</ButtonLabel>
              </ButtonContent>
            </>
          </NavLink>
        </Nav>

        <ButtonContainer>
          <ToggleThemeButton navOpen={navOpen} />
        </ButtonContainer>
      </Aside>
    </Wrapper>
  );
};

export default LayoutSideNav;

const ToggleThemeButton = ({ navOpen }: { navOpen: boolean }) => {
  // Its hardcoded on @swingby-protocol/pulsar/src/modules/themes/PulsarThemeProvider/index.tsx:17
  const [selectedTheme, toggleTheme] = useState('auto');

  const handleClick = () => {
    if (selectedTheme === 'auto') return;
    if (selectedTheme === 'light') {
      toggleTheme('dark');
    } else {
      toggleTheme('light');
    }
  };

  let text;
  let iconName: IconNames;

  if (selectedTheme === 'light') {
    text = 'Light Theme';
    iconName = 'menu-theme-light';
  } else if (selectedTheme === 'dark') {
    text = 'Dark Theme';
    iconName = 'menu-theme-dark';
  } else {
    text = 'Auto Theme (OS)';
    iconName = 'menu-theme-auto';
  }

  return (
    <Button onClick={handleClick}>
      <Icon name={iconName} />
      <ButtonContent navOpen={navOpen}>
        <ButtonLabel>{text}</ButtonLabel>
      </ButtonContent>
    </Button>
  );
};
