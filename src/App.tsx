import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './utils/useAuth';
import Login from './pages/Login/Login';
import SignUp from './pages/Signup/SignUp';
import AlliancesList from './pages/AllianceList/AllianceList';
import CreateAlliance from './pages/CreateAlliance/CreateAlliance';
import AllianceDashboard from './pages/AllianceDashboard/AllianceDashboard';
import Home from './pages/Home/Home';
import Layout from './components/Layout';
import styled from 'styled-components';
import GlobalStyle from './styles/globalStyles';
import { JoinAlliancePage } from './pages/JoinAlliancePage/JoinAlliancePage';
import AllTasks from './pages/AllTasks/AllTasks';
import { useEffect, useState } from 'react';
import { joinAlliance } from './utils/joinAlliance';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-family: 'Roboto', sans-serif;
  color: #333;

  @media (max-width: 600px) {
    font-size: 1.25rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;

  @media (max-width: 600px) {
    margin-top: 0.5rem;
    width: 100%;
    justify-content: space-around;
  }
`;

const NavLinkStyled = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #007bff;
  }
`;

function App() {
  const { user, authLoading } = useAuth(auth, db);
  const [redirectAllianceId, setRedirectAllianceId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (user && user.uid && redirectAllianceId) {
      joinAlliance({
        userId: user.uid,
        allianceId: redirectAllianceId,
      }).then(() => {
        window.location.href = `/alliance/${redirectAllianceId}`;
      });
    }
  }, [user, redirectAllianceId]);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <GlobalStyle />
      <Router>
        {user ? (
          <HeaderContainer>
            <Nav>
              <Logo>Procrastination Station :</Logo>
              <NavLinkStyled to='/'>Home</NavLinkStyled>
              <NavLinkStyled to='/alliance-list'>Alliance List</NavLinkStyled>
              <NavLinkStyled to='/create-alliance'>Create Alliance</NavLinkStyled>
            </Nav>
          </HeaderContainer>
        ) : (
          ``
        )}

        {user ? (
          <Layout>
            <Routes>
              <Route path='/' element={<PrivateRoute user={user} element={<Home />} />} />
              <Route path='/tasks' element={<PrivateRoute user={user} element={<AllTasks />} />} />
              <Route
                path='/alliance-list'
                element={<PrivateRoute user={user} element={<AlliancesList />} />}
              />
              <Route
                path='/create-alliance'
                element={<PrivateRoute user={user} element={<CreateAlliance />} />}
              />
              <Route
                path='/alliance/:allianceId'
                element={<PrivateRoute user={user} element={<AllianceDashboard />} />}
              />
              <Route
                path='/join-alliance/:allianceId'
                element={<PrivateRoute user={user} element={<JoinAlliancePage />} />}
              />
              <Route path='*' element={<Navigate to='/' />} />
            </Routes>
          </Layout>
        ) : (
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route
              path='/join-alliance/:allianceId'
              element={<JoinAlliancePage setRedirectAllianceId={setRedirectAllianceId} />}
            />
            <Route path='*' element={<Navigate to='/login' />} />
          </Routes>
        )}
      </Router>
    </>
  );
}

export default App;
