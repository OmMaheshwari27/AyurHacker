import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const PrivateRoute = ({ component: Component }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading } = authContext;

  if (loading) return <p>Loading...</p>;
  
  if (isAuthenticated) {
    return <Component />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute; 