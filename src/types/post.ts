export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  createdAt?: string;
  updatedAt?:string;
}

export interface CreatePostDto {
  title: string;
  body: string;
  userId: number;
}

export interface UpdatePostDto {
  title: string;
  body: string;
}

export interface PostState {
  data: Post[];
  loading: boolean;
  error: string | null;
  currentPost: Post | null;
}