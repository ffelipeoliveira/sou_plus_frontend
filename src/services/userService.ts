import { randomUserApi } from './api';
import type { AppUser, User } from '../types/user';

export const getRandomUser = async (): Promise<AppUser> => {
	try {
		const response = await randomUserApi.get<{ results: User[] }>
		('?nat=br&inc=name,email,phone,picture,dob,login', { timeout: 5000});

		if (!response.data.results || response.data.results.length === 0) {
			throw new Error('No user data received');
		}
		
		const user =  response.data.results[0];

		const appUser: AppUser = {
			name: user.name || { title: 'Usuário', first: 'Anônimo', last: '' },
			email: user.email || 'email@indisponivel.com',
			phone: user.phone || '(00) 0000-0000',
			picture: user.picture || { large: '', medium: 'https://via.placeholder.com/150', thumbnail: '' },
			dob: user.dob || { date: new Date().toISOString(), age: 0 },
			token: user.login.sha256  || ''
		};

		return appUser;
	} catch (error) {
		console.error('Error fetching random user: ', error);
		throw new Error('Failed to fetch user data');
	}
}