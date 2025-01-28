import { useState } from 'react';
import styled from 'styled-components';
import { signOut } from 'firebase/auth';
import { useAuth } from '../utils/useAuth';
import { auth, db } from '../../firebaseConfig';
import { NavLink } from 'react-router-dom';

const HamburgerIcon = styled.div`
  position: fixed;
  top: 4em;
  left: 4em;
  z-index: 999;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 2em;
  width: 3em;

  span {
    display: block;
    width: 100%;
    height: 0.25rem;
    background-color: #374e56;
    border-radius: 0.125rem;
    transition:
      transform 0.3s ease,
      opacity 0.3s ease;
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const Sidebar = styled.div<{ isopen: boolean }>`
  position: fixed;
  top: 0;
  left: ${({ isopen }) => (isopen ? '0' : '-100%')};
  height: 100vh;
  width: 90%;
  background-color: #feffff;
  border-right: 1px solid #e6e8ec;
  color: #000000;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 998;
  transition: left 0.3s ease;

  padding: 2em;

  @media (min-width: 768px) {
    position: static;
    height: auto;
    width: 12%;
    flex-direction: column;
    border-right: none;
    left: auto;
    right: auto;
    top: 2em;
    margin: 2em;
    padding: 0;
  }
`;

const Overlay = styled.div<{ isopen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ isopen }) => (isopen ? 'block' : 'none')};
  z-index: 100;
`;

const NavLinks = styled.ul`
  list-style: none;
  padding: 0;
  gap: 2em;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;

  li {
  }

  a {
    color: #000000;
    text-decoration: none;
    font-size: 1em;

    &:hover {
      color: #374e56;
    }

    &.active {
      display: flex;
      color: #374e56;
      font-weight: 500;
      background-color: #f3f5fe;
      border-radius: 2em;
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    justify-content: center;
    align-items: center;

    li {
      text-align: center;
    }
  }
`;

const MenuBar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (min-width: 768px) {
    align-items: flex-start;
  }
`;

const LogoutButton = styled.button`
  font-family: 'Montserrat', serif;
  font-weight: 400;
  padding: 16px;
  font-size: 1em;
  /* box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); */
  background-color: #35328b;
  color: white;
  border-radius: 20px;
  cursor: pointer;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const Navbar = () => {
  const { user } = useAuth(auth, db);
  const allianceId = user?.allianceIds?.[0];
  const allianceLink = allianceId ? `/alliance/${allianceId}` : '/create-alliance';
  const [isopen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign Out Error:', err);
    }
  };

  return (
    <>
      <HamburgerIcon onClick={() => setIsOpen((prev) => !prev)}>
        <span />
        <span />
        <span />
      </HamburgerIcon>
      <Overlay isopen={isopen} onClick={() => setIsOpen(false)} />
      <Sidebar isopen={isopen}>
        <MenuBar>
          <NavLinks>
            <li>
              <NavLink
                to='/todaystask'
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setIsOpen(false)}
              >
                Today's Task
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/tasks'
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setIsOpen(false)}
              >
                My Tasks
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/projects'
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setIsOpen(false)}
              >
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink
                to={allianceLink}
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setIsOpen(false)}
              >
                Alliance
              </NavLink>
            </li>
          </NavLinks>
        </MenuBar>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Sidebar>
    </>
  );
};

export default Navbar;
