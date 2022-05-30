import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
`;

export const Aside = styled.aside<{ open: boolean }>`
  position: sticky;
  top: 0;
  display: grid;
  grid-template-rows: min-content;
  flex-shrink: 0;
  width: ${({ open }) => (open ? '216px' : '72px')};
  height: 100vh;
  padding: 24px 16px;
  overflow: hidden;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.pulsar.color.bg.accent};
  border-right: 1px solid ${({ theme }) => theme.pulsar.color.border.normal};
  transition: all 0.2s linear;

  @media (max-width: 768px) {
    position: fixed;
    left: ${({ open }) => (open ? '0' : '-100%')};
    z-index: 10;
    width: 275px !important;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  margin-bottom: 48px;
  overflow: hidden;
  padding: 0 8px;
  transition: width 0.3s linear;
`;

export const LogoLink = styled.a`
  text-decoration: none;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

export const LogoLabel = styled.text<{ navOpen: boolean }>`
  font-weight: bold;
  color: ${({ theme }) => theme.pulsar.color.text.normal};
  flex-shrink: 0;
  margin-left: 12px;
  overflow: hidden;
  visibility: ${(props) => (props.navOpen ? 'visible' : 'hidden')};
`;

export const Nav = styled.nav``;

export const NavLink = styled.a`
  text-decoration: none;
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background-color: transparent;
  border: 0;
  border-radius: 4px;
  text-align: left;
  padding: 0 8px;
  margin-bottom: 24px;

  &:hover {
    svg {
      --icon-display__light: none;
      --icon-display__dark: none;
      --icon-display__hover: block;
    }
    text {
      color: ${({ theme }) => theme.pulsar.color.text.normal};
    }
  }

  svg {
    flex-shrink: 0;
  }
`;

export const ButtonContainer = styled.div`
  position: relative;
  display: flex;
  align-items: end;
  width: 100%;
  background-color: transparent;
  border: 0;
  border-radius: 4px;
  text-align: left;
`;

export const ButtonContent = styled.div<{ navOpen: boolean }>`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: start;
  margin-left: 16px;
  visibility: ${(props) => (props.navOpen ? 'visible' : 'hidden')};

  > div {
    white-space: nowrap;
    overflow: hidden;
  }
`;

export const ButtonLabel = styled.text`
  font-weight: bold;
  color: ${({ theme }) => theme.pulsar.color.text.placeholder};
  &:hover {
    color: ${({ theme }) => theme.pulsar.color.text.normal};
  }
`;

export const ButtonText = styled.text`
  font-weight: bold;
  color: ${({ theme }) => theme.pulsar.color.text.normal};
`;

export const Mask = styled.div<{ navOpen: boolean }>`
  background-color: rgba(19, 32, 43, 0.8);
  bottom: 0;
  height: 100%;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  visibility: hidden;
  width: ${(props) => (props.navOpen ? '100%' : '0')};
  z-index: 9;

  @media (max-width: 768px) {
    visibility: ${(props) => (props.navOpen ? 'visible' : 'hidden')};
  }
`;

export const CloseButton = styled.button`
  background-color: transparent;
  border: 0;
  display: none;
  height: 24px;
  margin-right: 12px;
  padding: 0;
  width: 24px;

  @media (max-width: 768px) {
    display: block;
  }
`;

export const Button = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background-color: transparent;
  border: 0;
  border-radius: 4px;
  text-align: left;

  --icon-display__light: none;
  --icon-display__dark: block;
  --icon-display__hover: block;

  &:hover {
    svg {
      --icon-display__light: none;
      --icon-display__dark: block;
      --icon-display__hover: block;
    }
    text {
      color: ${({ theme }) => theme.pulsar.color.text.normal};
    }
  }
`;
