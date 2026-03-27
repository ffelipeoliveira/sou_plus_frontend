import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { authApi } from '../services/api';
import { userAtom, isAuthenticatedAtom } from '../utils/atoms';
import SEO from '../components/seo/SEO';

interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
}

export default function RegisterPage() {
    const navigate = useNavigate();
    const setUser = useSetAtom(userAtom);
    const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
    
    const [formData, setFormData] = useState<RegisterFormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
    });
    
    const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: Partial<RegisterFormData> = {};
        
        if (!formData.username) {
            newErrors.username = 'Usuário é obrigatório';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Usuário deve ter pelo menos 3 caracteres';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = 'Usuário pode conter apenas letras, números e underscore';
        }
        
        if (!formData.email) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        
        if (!formData.password) {
            newErrors.password = 'Senha é obrigatória';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
        } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Senha deve conter pelo menos uma letra e um número';
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'As senhas não coincidem';
        }
        
        if (!formData.fullName) {
            newErrors.fullName = 'Nome completo é obrigatório';
        } else if (formData.fullName.length < 2) {
            newErrors.fullName = 'Nome deve ter pelo menos 2 caracteres';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof RegisterFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        
        try {
            const user = await authApi.register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName
            });
            
            setUser(user);
            setIsAuthenticated(true);
            navigate('/');
        } catch (err: any) {
            console.error('Registration error:', err);
            if (err.response?.data?.message) {
                setServerError(err.response.data.message);
            } else {
                setServerError('Erro ao criar conta. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SEO 
                title="Cadastro | SOU+"
                description="Crie sua conta no SOU+ e comece a conversar"
                noIndex={true}
            />
            
            <div className="register-container screen-center">
                <div className="register-card">
                    <div className="register-header">
                        <h1 className="bebas-neue">Criar Conta</h1>
                        <p>Junte-se à comunidade SOU+</p>
                    </div>
                    
                    {serverError && (
                        <div className="error-message error">
                            {serverError}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="form-group">
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Nome completo"
                                value={formData.fullName}
                                onChange={handleChange}
                                disabled={loading}
                                className={errors.fullName ? 'input-error' : ''}
                            />
                            {errors.fullName && (
                                <span className="error-text error">{errors.fullName}</span>
                            )}
                        </div>
                        
                        <div className="form-group">
                            <input
                                type="text"
                                name="username"
                                placeholder="Nome de usuário"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={loading}
                                className={errors.username ? 'input-error' : ''}
                            />
                            {errors.username && (
                                <span className="error-text error">{errors.username}</span>
                            )}
                        </div>
                        
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                                className={errors.email ? 'input-error' : ''}
                            />
                            {errors.email && (
                                <span className="error-text error">{errors.email}</span>
                            )}
                        </div>
                        
                        <div className="form-group">
                            <input
                                type="password"
                                name="password"
                                placeholder="Senha"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                                className={errors.password ? 'input-error' : ''}
                            />
                            {errors.password && (
                                <span className="error-text error">{errors.password}</span>
                            )}
                        </div>
                        
                        <div className="form-group">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirmar senha"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={loading}
                                className={errors.confirmPassword ? 'input-error' : ''}
                            />
                            {errors.confirmPassword && (
                                <span className="error-text error">{errors.confirmPassword}</span>
                            )}
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="register-button"
                        >
                            {loading ? 'Criando conta...' : 'Cadastrar'}
                        </button>
                    </form>
                    
                    <div className="register-footer">
                        <p>
                            Já tem uma conta?{' '}
                            <Link to="/login" className="login-link">
                                Faça login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            
            <style>{`
                .register-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    padding: 20px;
                }
                
                .register-card {
                    background: var(--bg-color-sub);
                    padding: 40px;
                    border-radius: 12px;
                    width: 100%;
                    max-width: 450px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                }
                
                .register-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                
                .register-header h1 {
                    margin: 0 0 10px 0;
                    font-size: 2.5rem;
                }
                
                .register-header p {
                    margin: 0;
                    opacity: 0.8;
                }
                
                .register-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                
                .form-group {
                    display: flex;
                    flex-direction: column;
                }
                
                .input-error {
                    border-bottom-color: var(--error-color) !important;
                }
                
                .error-text {
                    font-size: 0.85rem;
                    margin-top: 5px;
                }
                
                .register-button {
                    background: var(--color);
                    color: white;
                    padding: 12px;
                    border-radius: 6px;
                    font-weight: bold;
                    margin-top: 10px;
                    transition: all 0.3s;
                }
                
                .register-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    filter: brightness(0.95);
                }
                
                .register-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                
                .register-footer {
                    text-align: center;
                    margin-top: 25px;
                    padding-top: 20px;
                    border-top: 1px solid var(--text-color);
                    opacity: 0.8;
                }
                
                .login-link {
                    color: var(--color);
                    text-decoration: underline;
                    font-weight: bold;
                }
                
                .login-link:hover {
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