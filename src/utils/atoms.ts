import { atom } from 'jotai';
import type { AppUser } from '../types/user';

export const userAtom = atom<AppUser | null>(null);

export const isAuthenticatedAtom = atom<boolean>(false);

export const authLoadingAtom = atom<boolean>(true);

export interface Notification {
    message: string;
    type: 'success' | 'error' | 'info';
}

export const notificationAtom = atom<Notification | null>(null);

export const userAvatarAtom = atom((get) => {
    const user = get(userAtom);
    return user?.profilePicture || 'https://via.placeholder.com/150';
});

export const userDisplayNameAtom = atom((get) => {
    const user = get(userAtom);
    if (!user) return 'Usuário';
    return user.fullName || user.username || 'Usuário';
});

export const userInitialsAtom = atom((get) => {
    const user = get(userAtom);
    if (!user) return '?';
    
    const name = user.fullName || user.username;
    if (!name) return '?';
    
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
});