import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { authApi } from '../services/api';
import { userAtom, isAuthenticatedAtom } from '../utils/atoms';

export default function Login() {
    const navigate = useNavigate();
    const setUser = useSetAtom(userAtom);
    const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const user = await authApi.login({ email, password });
            setUser(user);
            setIsAuthenticated(true);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="screen-center">
            <form onSubmit={handleSubmit} className="login-form">
                <h1>Login</h1>
                {error && <div className="error">{error}</div>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Login'}
                </button>
                <p>
                    Don't have an account? <a href="/register">Register</a>
                </p>
            </form>
        </div>
    );
}