import type { Post } from './post';

export interface PostFormValues {
  title: string;
  body: string;
}

export type PostFormMode = 'create' | 'edit';

export interface PostFormProps {
  mode: PostFormMode;
  post?: Post;
  onSubmit: (values: PostFormValues) => Promise<void>;
}