import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSetAtom, useAtom } from 'jotai';
import { userAtom, isAuthenticatedAtom } from './utils/atoms';
import { useEffect, useState } from 'react';
import { userApi } from './services/api';
import Homepage from './pages/Home/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostDetail from './pages/PostDetail';
import NotFound from './pages/NotFound';
import Navbar from './components/layout/navbar/Navbar';
import FullScreenLoading from './components/common/loading/FullScreenLoading';

function App() {
    const [user, setUser] = useAtom(userAtom);
    const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoading(false);
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
                setIsLoading(false);
            }
        };
        
        checkAuth();
    }, []);

    if (isLoading) {
        return <FullScreenLoading />;
    }

    return (
        <BrowserRouter>
            <Navbar />
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
                        path="/post/:id" 
                        element={isAuthenticated ? <PostDetail /> : <Navigate to="/login" />} 
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;