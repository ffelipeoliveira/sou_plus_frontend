import { Link, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom, isAuthenticatedAtom } from '../../../utils/atoms';
import { authApi } from '../../../services/api';
import { FaSignOutAlt, FaUser, FaComments } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
import Avatar from '../../common/Avatar';
import Logo from '../logo/Logo';

function Navbar() {
    const [user] = useAtom(userAtom);
    const [, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        authApi.logout();
        setIsAuthenticated(false);
        navigate('/login');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get user initials for avatar fallback
    const getUserInitials = () => {
        if (!user) return '?';
        const name = user.fullName || user.username;
        if (!name) return '?';
        const parts = name.split(' ');
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    return (
        <>
            <div className="navbar-wrapper"></div>
            <nav className="navbar">
                <div className="navbar-container">
                    {/* Left side - User Profile */}
                    <div className="navbar-left">
                        {user && (
                            <div className="user-profile-trigger" ref={dropdownRef}>
                                <button 
                                    className="profile-button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    aria-label="Menu do usuário"
                                >
                                    <Avatar
                                        src={user.profilePicture}
                                        alt={user.fullName || user.username}
                                        size={40}
                                        initials={getUserInitials()}
                                    />
                                    <span className="user-name">{user.fullName || user.username}</span>
                                    <span className="dropdown-arrow">{isDropdownOpen ? '▲' : '▼'}</span>
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="dropdown-menu">
                                        <div className="dropdown-header">
                                            <Avatar
                                                src={user.profilePicture}
                                                alt={user.fullName || user.username}
                                                size={50}
                                                initials={getUserInitials()}
                                            />
                                            <div className="dropdown-user-info">
                                                <strong>{user.fullName || user.username}</strong>
                                                <span className="dropdown-username">@{user.username}</span>
                                                <span className="dropdown-email">{user.email}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="dropdown-divider"></div>
                                        
                                        <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                                            <FaUser className="dropdown-icon" />
                                            Meu Perfil
                                        </Link>
                                        
                                        <Link to="/" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                                            <FaComments className="dropdown-icon" />
                                            Conversas
                                        </Link>
                                        
                                        <div className="dropdown-divider"></div>
                                        
                                        <button onClick={handleLogout} className="dropdown-item logout-item">
                                            <FaSignOutAlt className="dropdown-icon" />
                                            Sair
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <Logo/>

                    {/* Right side - Spacer for balance */}
                    <div className="navbar-right"></div>
                </div>
            </nav>

            <style>{`
                .navbar-wrapper {
                    height: 70px;
                }

                .navbar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: var(--bg-color-sub);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid var(--bg-color-focus);
                    z-index: 1000;
                    height: 70px;
                }

                .navbar-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                    height: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                /* Left side */
                .navbar-left {
                    width: 200px;
                    display: flex;
                    justify-content: flex-start;
                }

                .user-profile-trigger {
                    position: relative;
                }

                .profile-button {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 8px 12px;
                    border-radius: 40px;
                    transition: all 0.3s;
                    color: var(--text-color);
                }

                .profile-button:hover {
                    background: var(--bg-color-focus);
                }

                .user-name {
                    font-size: 0.9rem;
                    font-weight: 500;
                    max-width: 120px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .dropdown-arrow {
                    font-size: 0.7rem;
                    opacity: 0.7;
                }

                /* Dropdown Menu */
                .dropdown-menu {
                    position: absolute;
                    top: calc(100% + 10px);
                    left: 0;
                    min-width: 280px;
                    background: var(--bg-color-sub);
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    overflow: hidden;
                    animation: slideDown 0.2s ease;
                    border: 1px solid var(--bg-color-focus);
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .dropdown-header {
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: var(--bg-color);
                }

                .dropdown-user-info {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    flex: 1;
                }

                .dropdown-user-info strong {
                    font-size: 0.95rem;
                }

                .dropdown-username {
                    font-size: 0.8rem;
                    opacity: 0.7;
                }

                .dropdown-email {
                    font-size: 0.75rem;
                    opacity: 0.6;
                    word-break: break-all;
                }

                .dropdown-divider {
                    height: 1px;
                    background: var(--bg-color-focus);
                    margin: 8px 0;
                }

                .dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    color: var(--text-color);
                    text-decoration: none;
                    transition: all 0.3s;
                    cursor: pointer;
                    width: 100%;
                    background: transparent;
                    border: none;
                    font-size: 0.9rem;
                }

                .dropdown-item:hover {
                    background: var(--bg-color-focus);
                }

                .dropdown-icon {
                    font-size: 1rem;
                    opacity: 0.8;
                }

                .logout-item {
                    color: var(--error-color);
                }

                .logout-item:hover {
                    background: var(--error-color);
                    color: white;
                }

                /* Center - Logo */
                .navbar-logo {
                    text-decoration: none;
                }

                .logo-text {
                    font-family: "Bebas Neue", sans-serif;
                    font-size: 1.8rem;
                    letter-spacing: 2px;
                    color: var(--text-color);
                }

                .logo-not {
                    color: var(--color);
                }

                /* Right side spacer */
                .navbar-right {
                    width: 200px;
                }

                /* Mobile Responsive */
                @media (max-width: 768px) {
                    .navbar-wrapper {
                        height: 60px;
                    }

                    .navbar {
                        height: 60px;
                    }

                    .navbar-container {
                        padding: 0 15px;
                    }

                    .navbar-left, .navbar-right {
                        width: auto;
                    }

                    .user-name {
                        display: none;
                    }

                    .profile-button {
                        padding: 5px;
                    }

                    .dropdown-arrow {
                        display: none;
                    }

                    .logo-text {
                        font-size: 1.4rem;
                    }

                    .dropdown-menu {
                        min-width: 260px;
                        right: 0;
                        left: auto;
                    }
                }

                @media (max-width: 480px) {
                    .dropdown-menu {
                        position: fixed;
                        top: 60px;
                        left: 0;
                        right: 0;
                        width: auto;
                        margin: 10px;
                        border-radius: 12px;
                    }
                }
            `}</style>
        </>
    );
}

export default Navbar;