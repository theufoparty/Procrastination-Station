import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { signOut } from 'firebase/auth';
import { useAuth } from '../utils/useAuth';
import { auth, db } from '../../firebaseConfig';
import { Link } from 'react-router-dom';

const HamburgerIcon = styled.div`
  position: fixed;
  top: 1.2em;
  right: 1.2em;
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
    background-color: #000;
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
  right: ${({ isopen }) => (isopen ? '0' : '-100%')};
  height: 100vh;
  width: 90%;
  background-color: #feffff;
  border-left: 1px solid #e6e8ec;
  color: #000000;
  padding: 1rem 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 998;
  transition: right 0.3s ease;

  @media (min-width: 768px) {
    position: static;
    height: auto;
    width: 20%;
    border-radius: 1em 0em 0em 1em;
    border-right: 1px solid #e6e8ec;
    flex-direction: column;
    border-left: none;
    left: auto;
    right: auto;
    top: 2em;
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

const Greeting = styled.h2`
  font-size: 2em;
  font-weight: 100;
  margin-bottom: 2em;
  margin-top: 5em;

  @media (min-width: 768px) {
    margin-top: 1em;
  }
`;

const NavLinks = styled.ul`
  list-style: none;
  padding: 0;
  gap: 2em;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  li {
    margin: 1rem 0;
  }

  a {
    color: #000000;
    text-decoration: none;
    font-size: 1.2rem;

    &:hover {
      color: #000000;
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
  font-weight: 300;
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #252525;
  background: none;
  color: #252525;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;

  &:hover {
    background-color: #252525;
    color: #fff;
  }
`;

const Navbar = () => {
  const { user } = useAuth(auth, db);

  const allianceId = user?.allianceIds?.[0];
  const allianceLink = allianceId ? `/alliance/${allianceId}` : '/create-alliance';

  const [greeting, setGreeting] = useState<string>('Hello');
  const [isopen, setIsOpen] = useState(false);

  const determineGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return 'Good morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Good day';
    } else if (currentHour >= 18 && currentHour < 22) {
      return 'Good evening';
    } else {
      return 'Good night';
    }
  };

  useEffect(() => {
    setGreeting(determineGreeting());

    const now = new Date();
    const millisUntilNextHour =
      (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000 - now.getMilliseconds();

    const timeoutId = setTimeout(() => {
      setGreeting(determineGreeting());

      const intervalId = setInterval(
        () => {
          setGreeting(determineGreeting());
        },
        60 * 60 * 1000
      );

      return () => clearInterval(intervalId);
    }, millisUntilNextHour);

    return () => clearTimeout(timeoutId);
  }, []);

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
          <Greeting>
            {greeting}, {user?.displayName || user?.email}
          </Greeting>
          <NavLinks>
            <li>
              <Link to='/todaystask' onClick={() => setIsOpen(false)}>
                Today's Task
              </Link>
            </li>
            <li>
              <Link to='/tasks' onClick={() => setIsOpen(false)}>
                My Tasks
              </Link>
            </li>
            <li>
              <Link to='/projects' onClick={() => setIsOpen(false)}>
                Projects
              </Link>
            </li>
            <li>
              <Link to={allianceLink} onClick={() => setIsOpen(false)}>
                Alliance
              </Link>
            </li>
          </NavLinks>
        </MenuBar>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Sidebar>
    </>
  );
};

export default Navbar;
