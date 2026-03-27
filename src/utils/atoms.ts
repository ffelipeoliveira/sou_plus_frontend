import { atom } from 'jotai';
import type { AppUser } from '../types/user';
import type { Post } from '../types/post';

export const userAtom = atom<AppUser | null>(null);
export const postsAtom = atom<Post[]>([]);
export const notificationAtom = atom<{
  message: string;
  type: 'success' | 'error';
} | null>(null);