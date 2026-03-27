import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAtom } from "jotai";
import { userAtom, notificationAtom } from "../utils/atoms";
import { IoMdArrowBack } from "react-icons/io";
import Loading from "../components/common/loading/Loading";
import MessageList from "../components/features/messages/MessageList";
import type { Message } from "../types/message";

const MessageDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [notification, setNotification] = useAtom(notificationAtom);

  // Fetch conversation messages
  const fetchMessages = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/messages/conversation/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          // No messages yet, that's fine
          setMessages([]);
          return;
        }
        throw new Error('Failed to fetch messages');
      }
      
      const data = await response.json();
      setMessages(data);
      
      // Fetch user info for the other participant
      const userResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setOtherUser(userData);
      }
      
    } catch (error) {
      console.error('Error fetching messages:', error);
      setNotification({ 
        message: 'Erro ao carregar mensagens', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Send a new message
  const sendMessage = async (content: string) => {
    if (!userId) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          receiverId: parseInt(userId),
          content
        })
      });
      
      if (!response.ok) throw new Error('Failed to send message');
      
      const newMessage = await response.json();
      setMessages(prev => [...prev, newMessage]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setNotification({ 
        message: 'Erro ao enviar mensagem', 
        type: 'error' 
      });
    }
  };

  // Delete a message
  const handleDeleteMessage = async (messageId: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete message');
      
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      setNotification({ 
        message: 'Mensagem excluída', 
        type: 'success' 
      });
      
    } catch (error) {
      console.error('Error deleting message:', error);
      setNotification({ 
        message: 'Erro ao excluir mensagem', 
        type: 'error' 
      });
    }
  };

  // Mark message as read
  const markAsRead = async (messageId: number) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }
    
    fetchMessages();
  }, [userId]);

  // Mark messages as read when they're visible
  useEffect(() => {
    const unreadMessages = messages.filter(
      msg => msg.receiver_id === user?.id && !msg.is_read
    );
    
    unreadMessages.forEach(msg => markAsRead(msg.id));
  }, [messages, user?.id]);

  if (isLoading) {
    return (
      <div className="screen-center">
        <Loading />
      </div>
    );
  }

  if (!otherUser && messages.length === 0) {
    return (
      <div className="message-detail-container">
        <Link className="return-button" to="/">
          <IoMdArrowBack />
        </Link>
        
        <div className="screen-center">
          <div className="bebas-neue flex center">
            <p className="no-margin">CONVERSA</p>
            <p className="inverted-color-text no-margin">NÃO ENCONTRADA</p>
          </div>
          <br />
          <button 
            onClick={() => navigate('/')}
            className="back-home-button"
          >
            Voltar para o início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="message-detail-container">
      <div className="message-detail-header">
        <Link className="return-button" to="/">
          <IoMdArrowBack />
        </Link>
        
        <div className="user-info">
          {otherUser && (
            <>
              <img 
                src={otherUser.profilePicture || 'https://via.placeholder.com/150'} 
                alt={otherUser.fullName}
                className="user-avatar"
              />
              <div className="user-details">
                <h2>{otherUser.fullName}</h2>
                <span className="username">@{otherUser.username}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="messages-wrapper">
        <MessageList 
          messages={messages}
          currentUserId={user?.id}
          onSendMessage={sendMessage}
          onBack={() => navigate('/')}
          onDeleteMessage={handleDeleteMessage}
        />
      </div>

      <style>{`
        .message-detail-container {
          max-width: 800px;
          margin: 0 auto;
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--bg-color);
        }

        .message-detail-header {
          position: sticky;
          top: 0;
          background: var(--bg-color);
          border-bottom: 1px solid var(--bg-color-sub);
          padding: 15px 20px;
          display: flex;
          align-items: center;
          gap: 20px;
          z-index: 10;
        }

        .return-button {
          color: var(--text-color);
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          transition: transform 0.3s;
        }

        .return-button:hover {
          transform: translateX(-3px);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 15px;
          flex: 1;
        }

        .user-avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-details {
          flex: 1;
        }

        .user-details h2 {
          margin: 0;
          font-size: 1.1rem;
        }

        .username {
          font-size: 0.85rem;
          opacity: 0.7;
        }

        .messages-wrapper {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .back-home-button {
          background: var(--color);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s;
          margin-top: 20px;
        }

        .back-home-button:hover {
          transform: translateY(-2px);
          filter: brightness(0.95);
        }

        @media (max-width: 768px) {
          .message-detail-header {
            padding: 12px 15px;
          }

          .user-avatar {
            width: 40px;
            height: 40px;
          }

          .user-details h2 {
            font-size: 1rem;
          }

          .messages-wrapper {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default MessageDetail;