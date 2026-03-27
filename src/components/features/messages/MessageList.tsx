import { useState, useRef, useEffect } from 'react';
import { FaArrowLeft, FaPaperPlane, FaTrash, FaCheck, FaCheckDouble } from 'react-icons/fa6';
import type { Message } from '../../../types/message';

interface MessageListProps {
    messages: Message[];
    currentUserId?: number;
    onSendMessage: (content: string) => Promise<void>;
    onBack: () => void;
    onDeleteMessage?: (messageId: number) => Promise<void>;
}

export default function MessageList({ 
    messages, 
    currentUserId, 
    onSendMessage, 
    onBack,
    onDeleteMessage 
}: MessageListProps) {
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            await onSendMessage(newMessage.trim());
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (messageId: number) => {
        if (!onDeleteMessage) return;
        
        setDeletingId(messageId);
        try {
            await onDeleteMessage(messageId);
            setShowDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting message:', error);
        } finally {
            setDeletingId(null);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        
        if (diff < 60000) return 'agora';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} min`;
        if (diff < 86400000) {
            return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    };

    const formatFullDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="message-list">
            <div className="message-header">
                <button onClick={onBack} className="back-button">
                    <FaArrowLeft />
                </button>
                <h3>Conversa</h3>
            </div>

            <div className="messages-container">
                {messages.length === 0 ? (
                    <div className="no-messages">
                        <p>Nenhuma mensagem ainda.</p>
                        <small>Seja o primeiro a mandar um oi!</small>
                    </div>
                ) : (
                    messages.map((message) => {
                        const isOwn = message.sender_id === currentUserId;
                        return (
                            <div 
                                key={message.id} 
                                className={`message ${isOwn ? 'own' : 'other'}`}
                                onMouseEnter={() => isOwn && setShowDeleteConfirm(message.id)}
                                onMouseLeave={() => setShowDeleteConfirm(null)}
                            >
                                <div className="message-content-wrapper">
                                    <div className="message-content">
                                        <p>{message.content}</p>
                                        <div className="message-meta">
                                            <span className="message-time" title={formatFullDate(message.created_at)}>
                                                {formatTime(message.created_at)}
                                            </span>
                                            {isOwn && (
                                                <span className="message-status" title={message.is_read ? 'Lida' : 'Enviada'}>
                                                    {message.is_read ? <FaCheckDouble /> : <FaCheck />}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {isOwn && showDeleteConfirm === message.id && onDeleteMessage && (
                                        <button 
                                            className="delete-message-btn"
                                            onClick={() => handleDelete(message.id)}
                                            disabled={deletingId === message.id}
                                            title="Excluir mensagem"
                                        >
                                            {deletingId === message.id ? (
                                                <span className="deleting-spinner"></span>
                                            ) : (
                                                <FaTrash />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="message-input-form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    disabled={sending}
                />
                <button type="submit" disabled={sending || !newMessage.trim()}>
                    <FaPaperPlane />
                </button>
            </form>

            <style>{`
                .message-list {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }

                .message-header {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid var(--bg-color-sub);
                    margin-bottom: 20px;
                }

                .back-button {
                    background: transparent;
                    border: none;
                    color: var(--text-color);
                    cursor: pointer;
                    font-size: 1.2rem;
                    padding: 5px;
                    display: flex;
                    align-items: center;
                    transition: all 0.3s;
                }

                .back-button:hover {
                    transform: translateX(-3px);
                }

                .message-header h3 {
                    margin: 0;
                    font-size: 1.2rem;
                }

                .messages-container {
                    flex: 1;
                    overflow-y: auto;
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    max-height: calc(100vh - 180px);
                }

                .message {
                    display: flex;
                    animation: fadeIn 0.3s ease;
                }

                .message.own {
                    justify-content: flex-end;
                }

                .message.other {
                    justify-content: flex-start;
                }

                .message-content-wrapper {
                    max-width: 70%;
                    position: relative;
                    display: flex;
                    align-items: flex-end;
                    gap: 8px;
                }

                .message-content {
                    padding: 10px 15px;
                    border-radius: 18px;
                    position: relative;
                }

                .message.own .message-content {
                    background: var(--color);
                    color: white;
                    border-bottom-right-radius: 4px;
                }

                .message.other .message-content {
                    background: var(--bg-color-focus);
                    color: var(--text-color);
                    border-bottom-left-radius: 4px;
                }

                .message-content p {
                    margin: 0;
                    word-wrap: break-word;
                }

                .message-meta {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-top: 4px;
                    font-size: 0.7rem;
                }

                .message.own .message-meta {
                    justify-content: flex-end;
                }

                .message-time {
                    opacity: 0.7;
                }

                .message-status {
                    display: inline-flex;
                    align-items: center;
                    font-size: 0.65rem;
                }

                .delete-message-btn {
                    background: var(--error-color);
                    border: none;
                    color: white;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s;
                    flex-shrink: 0;
                }

                .delete-message-btn:hover:not(:disabled) {
                    transform: scale(1.1);
                }

                .delete-message-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .deleting-spinner {
                    width: 14px;
                    height: 14px;
                    border: 2px solid white;
                    border-top-color: transparent;
                    border-radius: 50%;
                    animation: spin 0.6s linear infinite;
                    display: inline-block;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .no-messages {
                    text-align: center;
                    padding: 40px;
                    opacity: 0.7;
                }

                .no-messages p {
                    margin: 0 0 5px 0;
                }

                .no-messages small {
                    font-size: 0.85rem;
                }

                .message-input-form {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid var(--bg-color-sub);
                }

                .message-input-form input {
                    flex: 1;
                    padding: 12px;
                    border: none;
                    border-radius: 8px;
                    background: var(--bg-color-focus);
                    color: var(--text-color);
                }

                .message-input-form button {
                    padding: 12px 20px;
                    background: var(--color);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .message-input-form button:hover:not(:disabled) {
                    transform: translateY(-2px);
                }

                .message-input-form button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (max-width: 768px) {
                    .message-content-wrapper {
                        max-width: 85%;
                    }

                    .messages-container {
                        max-height: calc(100vh - 160px);
                    }

                    .delete-message-btn {
                        width: 24px;
                        height: 24px;
                    }
                }
            `}</style>
        </div>
    );
}