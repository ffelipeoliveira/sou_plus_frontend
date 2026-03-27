import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { postsAtom, notificationAtom } from '../../utils/atoms';
import { getPosts, deletePost, createPost, updatePost } from '../../services/postService'; // Add updatePost
import Post from '../../components/features/post/Post';
import PostForm from '../../components/layout/form/Form';
import { FaPlus } from "react-icons/fa6";
import type { Post as PostType } from '../../types/post';

function Home() {
  const [posts, setPosts] = useAtom(postsAtom);
  const [, setNotification] = useAtom(notificationAtom);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<PostType | null>(null); // Track which post is being edited

  const fetchPosts = async () => {
    try {
      const posts = await getPosts();
      setPosts(posts);
    } catch (error) {
      setNotification({message: 'Erro ao carregar posts', type: 'error'});
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deletePost(id);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      setNotification({ message: 'Post excluído', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Falha ao deletar post', type: 'error' });
    }
  };

  const handleCreatePost = async (postData: { title: string; body: string }) => {
    try {
      console.log('Creating post with data:', postData);
      const createPostData = {
        ...postData,
        userId: 1,
      };
     
      console.log('Sending to API:', createPostData);
     
      const newPost = await createPost(createPostData);
      console.log('Post created successfully:', newPost);
     
      setPosts(prevPosts => [newPost, ...prevPosts]);
     
      setShowForm(false);
      setNotification({ message: 'Post criado com sucesso', type: 'success' });
    } catch (error) {
      console.error('Error in handleCreatePost:', error);
      setNotification({ message: 'Falha ao criar post', type: 'error' });
    }
  };

  const handleEdit = (id: number) => {
    const postToEdit = posts.find(post => post.id === id);
    if (postToEdit) {
      setEditingPost(postToEdit);
      setShowForm(true);
    }
  };

  const handleUpdatePost = async (postData: { title: string; body: string }) => {
    if (!editingPost) return;
    
    try {
      console.log('Updating post with data:', postData);
      
      const updatedPost = await updatePost(editingPost.id, postData);
      console.log('Post updated successfully:', updatedPost);
      
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === editingPost.id 
            ? { ...updatedPost, updatedAt: new Date().toISOString() }
            : post
        )
      );
      
      setShowForm(false);
      setEditingPost(null);
      setNotification({ message: 'Post atualizado com sucesso', type: 'success' });
    } catch (error) {
      console.error('Error in handleUpdatePost:', error);
      setNotification({ message: 'Falha ao atualizar post', type: 'error' });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPost(null);
  };

  const handleFormSuccess = editingPost ? handleUpdatePost : handleCreatePost;

  return (
    <div className="home">
      <div className="create-post">
        <div className="create-post-background"></div>
        <button onClick={() => setShowForm(!showForm)}>
          <div className={showForm ? 'rotated-45' : 'rotated-0'}>
            <FaPlus className='icon'/>
          </div>
        </button>
      </div>
      {showForm && (
        <PostForm
          post={editingPost || undefined} 
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      )}
      <div className="posts">
        {posts.map(post => (
          <Post key={post.id} post={post} onDelete={handleDelete} onEdit={handleEdit}/>
        ))}
      </div>
    </div>
  )
}

export default Home;