import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { signOut } from 'firebase/auth';
import { useAuth } from '../utils/useAuth';
import { auth, db } from '../../firebaseConfig';
import { Link } from 'react-router-dom';

const Sidebar = styled.div`
  width: 20%;
  background-color: #feffff;
  border-right: 1px solid #e6e8ec;
  color: #000000;
  left: 2em;
  top: 2em;
  padding: 2rem 1rem;
  border-radius: 1em 0 0 1em;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Greeting = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

const NavLinks = styled.ul`
  list-style: none;
  padding: 0;
  flex-grow: 1;

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

const LogoutButton = styled.button`
  padding: 0.5rem 1em;
  background-color: #3c64e7;
  border: none;
  border-radius: 0.5em;
  color: #ecf0f1;
  cursor: pointer;
  font-size: 1em;
  width: 60%;
  align-self: center;
  margin-top: 3em;

  &:hover {
    background-color: #9bb2ff;
  }
`;

const Navbar = () => {
  const { user } = useAuth(auth, db);

  const allianceId = user?.allianceIds?.[0];
  const allianceLink = allianceId ? `/alliance/${allianceId}` : '/create-alliance';

  const [greeting, setGreeting] = useState<string>('Hello');

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
    <Sidebar>
      <div>
        <Greeting>
          {greeting}, {user?.displayName || user?.email}
        </Greeting>
        <NavLinks>
          <li>
            <Link to='/todaystask'>Today's Task</Link>
          </li>
          <li>
            <Link to='/tasks'>All Tasks</Link>
          </li>
          <li>
            <Link to='/projects'>Projects</Link>
          </li>
          <li>
            <Link to={allianceLink}>Alliance</Link>
          </li>
        </NavLinks>
      </div>
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
    </Sidebar>
  );
};

export default Navbar;
