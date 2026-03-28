import { useAtom } from 'jotai';
import { userAtom } from '../../utils/atoms';
import { FaUser, FaEnvelope, FaPhone, FaCalendar } from 'react-icons/fa';

export default function UserProfile() {
    const [user] = useAtom(userAtom);

    if (!user) {
        return (
            <div className="user-profile">
                <div className="profile-placeholder">
                    <FaUser className="placeholder-icon" />
                    <p>Carregando...</p>
                </div>
            </div>
        );
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Não informado';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="user-profile">
            <div className="profile-header">
                <img 
                    src={user.profilePicture || 'https://via.placeholder.com/150'} 
                    alt={user.fullName || user.username}
                    className="profile-avatar"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                    }}
                />
                <div className="profile-info">
                    <h2 className="profile-name">{user.fullName || user.username}</h2>
                    <p className="profile-username">@{user.username}</p>
                </div>
            </div>

            <div className="profile-details">
                {user.email && (
                    <div className="profile-detail-item">
                        <FaEnvelope className="detail-icon" />
                        <div className="detail-content">
                            <span className="detail-label">Email</span>
                            <span className="detail-value">{user.email}</span>
                        </div>
                    </div>
                )}

                {user.phone && (
                    <div className="profile-detail-item">
                        <FaPhone className="detail-icon" />
                        <div className="detail-content">
                            <span className="detail-label">Telefone</span>
                            <span className="detail-value">{user.phone}</span>
                        </div>
                    </div>
                )}

                {user.createdAt && (
                    <div className="profile-detail-item">
                        <FaCalendar className="detail-icon" />
                        <div className="detail-content">
                            <span className="detail-label">Membro desde</span>
                            <span className="detail-value">{formatDate(user.createdAt)}</span>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .user-profile {
                    background: var(--bg-color-sub);
                    border-radius: 12px;
                    padding: 24px;
                    margin: 20px;
                }

                .profile-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 24px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid var(--bg-color-focus);
                }

                .profile-avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 3px solid var(--color);
                }

                .profile-info {
                    flex: 1;
                }

                .profile-name {
                    margin: 0 0 5px 0;
                    font-size: 1.5rem;
                    color: var(--text-color);
                }

                .profile-username {
                    margin: 0;
                    opacity: 0.7;
                    font-size: 0.9rem;
                }

                .profile-details {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .profile-detail-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 10px;
                    background: var(--bg-color);
                    border-radius: 8px;
                    transition: all 0.3s;
                }

                .profile-detail-item:hover {
                    transform: translateX(5px);
                    background: var(--bg-color-focus);
                }

                .detail-icon {
                    font-size: 1.2rem;
                    color: var(--color);
                    width: 24px;
                }

                .detail-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .detail-label {
                    font-size: 0.75rem;
                    opacity: 0.7;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .detail-value {
                    font-size: 1rem;
                    font-weight: 500;
                }

                .profile-placeholder {
                    text-align: center;
                    padding: 40px;
                }

                .placeholder-icon {
                    font-size: 3rem;
                    opacity: 0.5;
                    margin-bottom: 15px;
                }

                @media (max-width: 768px) {
                    .user-profile {
                        padding: 16px;
                        margin: 10px;
                    }

                    .profile-avatar {
                        width: 60px;
                        height: 60px;
                    }

                    .profile-name {
                        font-size: 1.2rem;
                    }

                    .detail-value {
                        font-size: 0.9rem;
                    }
                }
            `}</style>
        </div>
    );
}