import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { authApi } from '../services/api';
import { userAtom, isAuthenticatedAtom } from '../utils/atoms';
import SEO from '../components/seo/SEO';

export default function LoginPage() {
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
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Email ou senha inválidos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SEO 
                title="Login | SOU+"
                description="Faça login no SOU+"
                noIndex={true}
            />
            
            <div className="login-container screen-center">
                <div className="login-card">
                    <div className="login-header">
                        <h1 className="bebas-neue">SOU+</h1>
                        <p>Entre na sua conta</p>
                    </div>
                    
                    {error && (
                        <div className="error-message error">{error}</div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="login-form">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="login-button"
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>
                    
                    <div className="login-footer">
                        <p>
                            Não tem uma conta?{' '}
                            <Link to="/register" className="register-link">
                                Cadastre-se
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            
            <style>{`
                .login-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    padding: 20px;
                }
                
                .login-card {
                    background: var(--bg-color-sub);
                    padding: 40px;
                    border-radius: 12px;
                    width: 100%;
                    max-width: 400px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                }
                
                .login-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                
                .login-header h1 {
                    margin: 0 0 10px 0;
                    font-size: 2.5rem;
                }
                
                .login-header p {
                    margin: 0;
                    opacity: 0.8;
                }
                
                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                
                .login-button {
                    background: var(--color);
                    color: white;
                    padding: 12px;
                    border-radius: 6px;
                    font-weight: bold;
                    margin-top: 10px;
                    transition: all 0.3s;
                }
                
                .login-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    filter: brightness(0.95);
                }
                
                .login-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                
                .login-footer {
                    text-align: center;
                    margin-top: 25px;
                    padding-top: 20px;
                    border-top: 1px solid var(--text-color);
                    opacity: 0.8;
                }
                
                .register-link {
                    color: var(--color);
                    text-decoration: underline;
                    font-weight: bold;
                }
                
                .register-link:hover {
                    opacity: 0.8;
                }
                
                .error-message {
                    background: var(--error-color);
                    color: white;
                    padding: 12px;
                    border-radius: 6px;
                    margin-bottom: 20px;
                    text-align: center;
                }
            `}</style>
        </>
    );
}