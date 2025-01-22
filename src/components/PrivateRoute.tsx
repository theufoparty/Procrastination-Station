import { Navigate } from 'react-router-dom';
import { User } from 'firebase/auth';

interface PrivateRouteProps {
  element: JSX.Element;
  user: User | null;
}

const PrivateRoute = ({ element, user }: PrivateRouteProps) => {
  return user ? element : <Navigate to='/login' />;
};

export default PrivateRoute;
