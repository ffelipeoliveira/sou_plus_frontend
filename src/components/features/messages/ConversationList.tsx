import { FaUser, FaCircle } from 'react-icons/fa6';
import type { Conversation } from '../../../types/message';

interface ConversationListProps {
    conversations: Conversation[];
    onSelectConversation: (userId: number) => void;
    currentUserId?: number;
}

export default function ConversationList({ conversations, onSelectConversation, currentUserId }: ConversationListProps) {
    const formatLastMessageTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        
        if (diff < 60000) return 'agora';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} min`;
        if (diff < 86400000) return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        if (diff < 604800000) return date.toLocaleDateString('pt-BR', { weekday: 'short' });
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    };

    if (conversations.length === 0) {
        return (
            <div className="no-conversations">
                <FaUser className="icon" />
                <p>Nenhuma conversa ainda</p>
                <small>Comece a conversar com outros usuários!</small>
            </div>
        );
    }

    return (
        <div className="conversation-list">
            {conversations.map((conv) => (
                <button
                    key={conv.user_id}
                    className="conversation-item"
                    onClick={() => onSelectConversation(conv.user_id)}
                >
                    <div className="conversation-avatar">
                        <img 
                            src={conv.profilePicture || 'https://via.placeholder.com/150'} 
                            alt={conv.fullName}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                            }}
                        />
                        {conv.unread_count > 0 && (
                            <span className="unread-badge">{conv.unread_count}</span>
                        )}
                    </div>
                    
                    <div className="conversation-info">
                        <div className="conversation-name">
                            <strong>{conv.fullName}</strong>
                            <span className="conversation-username">@{conv.username}</span>
                        </div>
                        <div className="conversation-last-message">
                            {conv.last_message && (
                                <>
                                    <span className="last-message-text">
                                        {conv.last_message.length > 50 
                                            ? conv.last_message.substring(0, 50) + '...' 
                                            : conv.last_message}
                                    </span>
                                    <span className="last-message-time">
                                        {formatLastMessageTime(conv.last_message_time)}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </button>
            ))}

            <style>{`
                .conversation-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .conversation-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 12px;
                    background: transparent;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                    width: 100%;
                    text-align: left;
                }

                .conversation-item:hover {
                    background: var(--bg-color-focus);
                    transform: translateX(5px);
                }

                .conversation-avatar {
                    position: relative;
                    width: 50px;
                    height: 50px;
                    flex-shrink: 0;
                }

                .conversation-avatar img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .unread-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: var(--error-color);
                    color: white;
                    border-radius: 50%;
                    width: 22px;
                    height: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: bold;
                }

                .conversation-info {
                    flex: 1;
                    min-width: 0;
                }

                .conversation-name {
                    display: flex;
                    align-items: baseline;
                    gap: 8px;
                    margin-bottom: 4px;
                    flex-wrap: wrap;
                }

                .conversation-name strong {
                    font-size: 1rem;
                }

                .conversation-username {
                    font-size: 0.8rem;
                    opacity: 0.7;
                }

                .conversation-last-message {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.85rem;
                }

                .last-message-text {
                    opacity: 0.8;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .last-message-time {
                    font-size: 0.7rem;
                    opacity: 0.6;
                    flex-shrink: 0;
                }

                .no-conversations {
                    text-align: center;
                    padding: 60px 20px;
                }

                .no-conversations .icon {
                    font-size: 3rem;
                    opacity: 0.5;
                    margin-bottom: 15px;
                }

                .no-conversations p {
                    margin: 0 0 5px 0;
                    font-size: 1.1rem;
                }

                .no-conversations small {
                    opacity: 0.6;
                }

                @media (max-width: 768px) {
                    .conversation-item {
                        padding: 10px;
                    }

                    .conversation-avatar {
                        width: 40px;
                        height: 40px;
                    }

                    .conversation-name strong {
                        font-size: 0.9rem;
                    }

                    .last-message-text {
                        font-size: 0.8rem;
                    }
                }
            `}</style>
        </div>
    );
}