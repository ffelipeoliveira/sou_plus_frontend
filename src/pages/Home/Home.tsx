import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { userAtom, isAuthenticatedAtom } from '../../utils/atoms';
import { FaPlus, FaComments, FaUsers } from "react-icons/fa6";
import MessageList from '../../components/features/messages/MessageList';
import ConversationList from '../../components/features/messages/ConversationList';
import type { Message, Conversation } from '../../types/message';

function Home() {
    const [user] = useAtom(userAtom);
    const [isAuthenticated] = useAtom(isAuthenticatedAtom);
    const [activeTab, setActiveTab] = useState<'conversations' | 'messages'>('conversations');
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch conversations on mount
    useEffect(() => {
        if (isAuthenticated) {
            fetchConversations();
        }
    }, [isAuthenticated]);

    const fetchConversations = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/messages/conversations`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch conversations');
            
            const data = await response.json();
            setConversations(data);
        } catch (err) {
            setError('Erro ao carregar conversas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (userId: number) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/messages/conversation/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch messages');
            
            const data = await response.json();
            setMessages(data);
            setSelectedUser(userId);
            setActiveTab('messages');
        } catch (err) {
            setError('Erro ao carregar mensagens');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (content: string) => {
        if (!selectedUser) return;
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    receiverId: selectedUser,
                    content
                })
            });
            
            if (!response.ok) throw new Error('Failed to send message');
            
            const newMessage = await response.json();
            setMessages(prev => [...prev, newMessage]);
            
            // Refresh conversations to update last message
            fetchConversations();
        } catch (err) {
            setError('Erro ao enviar mensagem');
            console.error(err);
        }
    };

    if (!isAuthenticated) {
        return null; // Will redirect from App.tsx
    }

    return (
        <div className="home-container">
            <div className="home-header">
                <h1 className="bebas-neue">
                    Olá, {user?.fullName || user?.username}!
                </h1>
                <p>Bem-vindo ao NOT REAL Chat</p>
            </div>

            <div className="home-tabs">
                <button 
                    className={`tab ${activeTab === 'conversations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('conversations')}
                >
                    <FaUsers />
                    <span>Conversas</span>
                </button>
                {selectedUser && (
                    <button 
                        className={`tab ${activeTab === 'messages' ? 'active' : ''}`}
                        onClick={() => setActiveTab('messages')}
                    >
                        <FaComments />
                        <span>Mensagens</span>
                    </button>
                )}
            </div>

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)}>X</button>
                </div>
            )}

            {loading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            )}

            {!loading && activeTab === 'conversations' && (
                <div className="conversations-section">
                    <ConversationList 
                        conversations={conversations}
                        onSelectConversation={fetchMessages}
                        currentUserId={user?.id}
                    />
                </div>
            )}

            {!loading && activeTab === 'messages' && selectedUser && (
                <div className="messages-section">
                    <MessageList 
                        messages={messages}
                        currentUserId={user?.id}
                        onSendMessage={sendMessage}
                        onBack={() => {
                            setActiveTab('conversations');
                            setSelectedUser(null);
                            setMessages([]);
                        }}
                    />
                </div>
            )}

            <style>{`
                .home-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }

                .home-header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding: 20px;
                    background: var(--bg-color-sub);
                    border-radius: 12px;
                }

                .home-header h1 {
                    margin: 0 0 10px 0;
                    font-size: 2rem;
                }

                .home-header p {
                    margin: 0;
                    opacity: 0.8;
                }

                .home-tabs {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                    border-bottom: 2px solid var(--bg-color-sub);
                    padding-bottom: 10px;
                }

                .tab {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 20px;
                    background: transparent;
                    border: none;
                    color: var(--text-color);
                    cursor: pointer;
                    transition: all 0.3s;
                    border-radius: 8px;
                    font-size: 1rem;
                }

                .tab:hover {
                    background: var(--bg-color-sub);
                }

                .tab.active {
                    background: var(--color);
                    color: white;
                }

                .conversations-section,
                .messages-section {
                    background: var(--bg-color-sub);
                    border-radius: 12px;
                    padding: 20px;
                    min-height: 500px;
                }

                .error-message {
                    background: var(--error-color);
                    color: white;
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .error-message button {
                    background: transparent;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 1.2rem;
                }

                .loading-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 400px;
                }

                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid var(--bg-color-sub);
                    border-top-color: var(--color);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 768px) {
                    .home-container {
                        padding: 10px;
                    }

                    .tab span {
                        display: none;
                    }

                    .tab {
                        padding: 10px;
                        font-size: 1.2rem;
                    }

                    .home-header h1 {
                        font-size: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
}

export default Home;