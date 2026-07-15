import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const GuestRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    
    if (user) return <Navigate to="/" replace />;

    return children;
};

export default GuestRoute;