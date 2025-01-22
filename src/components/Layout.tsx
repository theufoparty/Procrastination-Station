import React from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #e6e8ec;

  @media (min-width: 768px) {
    display: flex;
    flex-direction: row;
    padding: 2em;
  }
`;

const MainContent = styled.main`
  padding: 2rem;
  border-radius: 0 1em 1em 0em;
  box-sizing: border-box;
  background-color: #feffff;
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
