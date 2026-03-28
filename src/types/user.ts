export interface AppUser {
    id: number;
    username: string;
    email: string;
    fullName: string;
    profilePicture: string;
    phone?: string;
    createdAt?: string;
    updatedAt?: string;
}


export interface User {
    id: number;
    username: string;
    email: string;
    full_name: string;
    profile_picture: string;
    phone?: string;
    created_at?: string;
    updated_at?: string;
}


export const convertToAppUser = (user: User): AppUser => ({
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.full_name,
    profilePicture: user.profile_picture,
    phone: user.phone,
    createdAt: user.created_at,
    updatedAt: user.updated_at
});