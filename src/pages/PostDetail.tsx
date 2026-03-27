import { useEffect, useState } from "react";
import { getPost, deletePost, updatePost } from "../services/postService";
import { useParams, useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import { notificationAtom } from "../utils/atoms";
import { Link } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import PostBox from "../components/features/post/Post";
import PostForm from "../components/layout/form/Form";
import Loading from "../components/common/loading/Loading";
import type { Post } from "../types/post";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const setNotification = useSetAtom(notificationAtom);

  const handleDelete = async (id: number) => {
    try {
      await deletePost(id);
      setNotification({ message: 'Post excluído', type: 'success' });
      navigate('/');
    } catch (error) {
      setNotification({ message: 'Error ao excluir post', type: 'error' });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdatePost = async (postData: { title: string; body: string }) => {
    if (!post) return;
    
    try {
      console.log('Updating post with data:', postData);
      
      const updatedPost = await updatePost(post.id, postData);
      console.log('Post updated successfully:', updatedPost);
      
      const updatedPostWithTimestamp = {
        ...post,
        ...updatedPost,
        updatedAt: new Date().toISOString()
      };
      
      setPost(updatedPostWithTimestamp);
      setIsEditing(false);
      setNotification({ message: 'Post atualizado com sucesso', type: 'success' });
    } catch (error) {
      console.error('Error in handleUpdatePost:', error);
      setNotification({ message: 'Falha ao atualizar post', type: 'error' });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!id) {
          navigate('/');
          return;
        }
       
        setIsLoading(true);
        const postData = await getPost(parseInt(id));
        setPost(postData);
      } catch (error) {
        setNotification({ message: 'Failed to load post', type: 'error' });
        setTimeout(() => {
            navigate('/');
        }, 5000);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate, setNotification]);

  if (isLoading) {
    return (
      <div className="screen-center">
        <Loading/>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="screen-center">
        <div className="bebas-neue flex center ">
            <p className="no-margin">POST</p>
            <p className="inverted-color-text no-margin">NOT FOUND</p>
        </div>
        <br/>
        Você será redirecionado em 5 segundos
      </div>
    );
  }

  return (
    <div className="post-details">
      <Link className="return" to={'/'}><IoMdArrowBack/></Link>
      
      {isEditing ? (
        <PostForm 
          post={post}
          onSuccess={handleUpdatePost}
          onCancel={handleCancelEdit}
        />
      ) : (
        <PostBox post={post} onDelete={handleDelete} onEdit={handleEdit} />
      )}
      
      <div className="comments">
        Não há comentários ainda (Não Implementado)
      </div>
    </div>
  );
};

export default PostDetail;