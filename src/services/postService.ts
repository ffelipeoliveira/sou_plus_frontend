import api from "./api";
import type { Post, CreatePostDto, UpdatePostDto } from "../types/post";

const getCurrentTimestamp = () => new Date().toISOString();

export const getPosts = async (): Promise<Post[]> => {
	const response = await api.get<Post[]>('/posts')
	return response.data.map(post => ({
		...post,
		createdAt: getCurrentTimestamp(),
		updatedAt: getCurrentTimestamp()
	}));
};

export const getPost = async (id: number): Promise<Post> => {
	const response = await api.get<Post>(`/posts/${id}`);

	return {
		...response.data,
		createdAt: response.data.createdAt || new Date().toISOString(),
		updatedAt: response.data.updatedAt || new Date().toISOString()
	};
};

export const createPost = async (postData: CreatePostDto): Promise<Post> => {
	const response = await api.post<Post>('/posts', {
		...postData,
		createdAt: getCurrentTimestamp(),
		updatedAt: getCurrentTimestamp(),
	});
	return response.data;
};

export const updatePost = async (id: number, postData: UpdatePostDto): Promise<Post> => {
	const response = await api.put(`/posts/${id}`, {
		...postData,
		updatedAt: getCurrentTimestamp()
	});
	return response.data;
};

export const deletePost = async (id: number): Promise<void> => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};