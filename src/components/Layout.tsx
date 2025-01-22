import React from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';

const Wrapper = styled.div`
  display: flex;
  padding: 2em;
  background-color: #e6e8ec;
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
