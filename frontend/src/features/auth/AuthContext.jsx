import { createContext, useState, useEffect } from 'react';
import { getMe } from '../dashboard/services/dashboardAPI';
import Loading from './components/Loading'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const userData = await getMe();
                setUser(userData.data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    if (loading) return <Loading />;

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, }}>
            {children}
        </AuthContext.Provider>
    );
};