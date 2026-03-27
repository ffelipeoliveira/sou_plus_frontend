export interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    is_read: boolean;
    created_at: string;
    sender_username?: string;
    sender_name?: string;
    sender_picture?: string;
    receiver_username?: string;
    receiver_name?: string;
    receiver_picture?: string;
}

export interface Conversation {
    user_id: number;
    username: string;
    fullName: string;
    profilePicture: string;
    last_message_time: string;
    last_message: string;
    unread_count: number;
}

export interface SendMessageDto {
    receiverId: number;
    content: string;
}