import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAtomValue } from "jotai";
import { userAtom } from "../../../utils/atoms";
import { deletePost } from "../../../services/postService";
import { formatPostDate, formatRelativeTime } from "../../../utils/dateUtils";
import { MdEdit, MdDelete } from "react-icons/md";
import type { Post } from "../../../types/post";
import './post.css';

interface PostProps {
  post: Post;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void; // Add this prop
}

const PostBox = ({ post, onDelete, onEdit }: PostProps) => {
  const user = useAtomValue(userAtom);

  const handleDelete = async (id: number) => {
    try {
      await deletePost(id);
      onDelete(id);
    } catch (error) {
      console.error("Failed to delete post: ", error);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="post"
    >
      <div className="flex space-between post-head">
        <div className="flex user">
          {user?.picture && (
            <img 
              className="profile-picture" 
              src={user.picture.medium} 
              alt={`${user.name.first} ${user.name.last}`}
            />
          )}
          <div>
            <h3 className="username bebas-neue">
              {`${user?.name.first} ${user?.name.last}`}
            </h3>
            <div className="date">
              {post.createdAt && (
                <>
                  <span title={formatPostDate(post.createdAt)}>
                    {formatRelativeTime(post.createdAt)}
                  </span>
                  {post.updatedAt && post.updatedAt !== post.createdAt && (
                    <span 
                      className="ml-2" 
                      title={`Editado em ${formatPostDate(post.updatedAt)}`}
                    >
                      (editado)
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="post-options flex space-between">
          <button 
            className="glow-on-hover" 
            onClick={() => onEdit(post.id)}
          >
            <MdEdit/>
          </button>
          <button 
            className="glow-on-hover" 
            onClick={() => handleDelete(post.id)}
          >
            <MdDelete/>
          </button>
        </div>
      </div>
      <Link className="post-content" to={`/post/${post.id}`}>
        <h2 className="post-title">{post.title}</h2>
        <p className="post-body">{post.body}</p>
      </Link>
    </motion.article>
  );
};

export default PostBox;