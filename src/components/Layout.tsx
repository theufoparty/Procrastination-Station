import React from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;

  @media (min-width: 768px) {
    display: flex;
    flex-direction: row;
  }
`;

const MainContent = styled.main`
  width: 100%;
  border-radius: 0 0 0 0;
  box-sizing: border-box;
  background-color: #eeeeee;
  @media (min-width: 768px) {
    width: 80%;
    border-radius: 1em;
    margin: 2em 2em 2em 0;
  }
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Wrapper>
      <Navbar />
      <MainContent>{children}</MainContent>
    </Wrapper>
  );
};

export default Layout;
