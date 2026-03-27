import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSetAtom, useAtom } from 'jotai';
import { userAtom, isAuthenticatedAtom, authLoadingAtom } from './utils/atoms';
import { useEffect } from 'react';
import { userApi } from './services/api';
import Homepage from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MessageDetail from './pages/MessageDetail';
import NotFound from './pages/NotFound';
import Navbar from './components/layout/navbar/Navbar';
import FullScreenLoading from './components/common/loading/FullScreenLoading';

function App() {
    const [user, setUser] = useAtom(userAtom);
    const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
    const [authLoading, setAuthLoading] = useAtom(authLoadingAtom);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setAuthLoading(false);
                return;
            }
            
            try {
                const userData = await userApi.getCurrentUser();
                setUser(userData);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Auth error:', error);
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            } finally {
                setAuthLoading(false);
            }
        };
        
        checkAuth();
    }, []);

    if (authLoading) {
        return <FullScreenLoading />;
    }

    return (
        <BrowserRouter>
            {isAuthenticated && <Navbar />}
            <main>
                <Routes>
                    <Route 
                        path="/" 
                        element={isAuthenticated ? <Homepage /> : <Navigate to="/login" />} 
                    />
                    <Route 
                        path="/login" 
                        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} 
                    />
                    <Route 
                        path="/register" 
                        element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} 
                    />
                    <Route 
                        path="/chat/:userId" 
                        element={isAuthenticated ? <MessageDetail /> : <Navigate to="/login" />} 
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;