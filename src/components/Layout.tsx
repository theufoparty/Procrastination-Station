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
  display: flex;
  flex-direction: column;
  margin: 2rem;
  border-radius: 20px;
  padding: 2em;
  min-height: 100vh;
  background-color: #f3f5fe;
  padding-top: 2em;

  @media (min-width: 768px) {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 0;
    width: 100%;
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
