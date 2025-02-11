import { contextData } from '@/context/AuthContext';
import PageLoader from './PageLoader';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: any) => {
  const { user, fetching } = contextData();

  // While fetching user data, show a loading screen or nothing
  if (fetching) return <PageLoader />;

  // If user is not logged in, redirect to the login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If user is logged in, render the children (protected component)
  return children;
};

export default PrivateRoute;
