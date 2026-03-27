import { atom } from 'jotai';
import type { AppUser } from '../types/user';

// User atom
export const userAtom = atom<AppUser | null>(null);

// Authentication state atom
export const isAuthenticatedAtom = atom<boolean>(false);

// Loading state for auth
export const authLoadingAtom = atom<boolean>(true);

// Optional: Notification atom (replaces the old notificationAtom)
export interface Notification {
    message: string;
    type: 'success' | 'error' | 'info';
}

export const notificationAtom = atom<Notification | null>(null);