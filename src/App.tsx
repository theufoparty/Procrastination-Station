import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './utils/useAuth';
import Login from './pages/Login/Login';
import SignUp from './pages/Signup/SignUp';
import CreateAlliance from './pages/CreateAlliance/CreateAlliance';
import AllianceDashboard from './pages/AllianceDashboard/AllianceDashboard';
import Home from './pages/Home/Home';
import Layout from './components/Layout';
import GlobalStyle from './styles/globalStyles';
import { JoinAlliancePage } from './pages/JoinAlliancePage/JoinAlliancePage';
import AllTasks from './pages/AllTasks/AllTasks';
import { useEffect, useState } from 'react';
import { joinAlliance } from './utils/joinAlliance';

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
          <Layout>
            <Routes>
              <Route path='/' element={<PrivateRoute user={user} element={<Home />} />} />
              <Route path='/tasks' element={<PrivateRoute user={user} element={<AllTasks />} />} />
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
