import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import type { Post } from "../../../types/post";
import '../../../styles/animations/animation.css';
import './form.css';
import { FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { TiCancel } from "react-icons/ti";

const postSchema = z.object({
    title: z.string().min(5, 'Título deve conter pelo menos 5 caracteres'),
    body: z.string().min(10, 'Conteúdo deve ter pelo menos 10 caracteres')
});

type PostFormValues = z.infer<typeof postSchema>;

interface FormProps {
  post?: Post;
  onSuccess: (data: { title: string; body: string }) => Promise<void> | void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const Form = ({ post, onSuccess, onCancel, isLoading = false }: FormProps) => {
    const isEditing = !!post;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<PostFormValues>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: post?.title || '',
            body: post?.body || ''
        }
    });

    const onSubmit = async (data: PostFormValues) => {
        try {
            await onSuccess(data);
            if (!isEditing) {
                reset();
            }
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="screen-center post-form"
        >
            <h2 className="bebas-neue inverted-color-text center">
                {isEditing ? 'EDITAR POST' : 'CRIAR POST'}
            </h2>
            <input
                type="text"
                className="title-input"
                placeholder="Título"
                {...register('title')}
                disabled={isSubmitting || isLoading}
            />
            {errors.title && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="error"
                >
                    {errors.title.message}
                </motion.p>
            )}
            <textarea
                rows={6}
                placeholder="Eu estive pensando..."
                {...register('body')}
                disabled={isSubmitting || isLoading}
            />
            {errors.body && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="error"
                >
                    {errors.body.message}
                </motion.p>
            )}
            <div className="flex space-between">
                {isEditing && onCancel && (
                    <button
                        type="button"
                        className="post-cancel-button glow-on-hover"
                        onClick={onCancel}
                    >
                        <TiCancel />
                    </button>
                )}
                <div></div>
                <button
                    type="submit"
                    className="post-form-button glow-on-hover"
                    disabled={isSubmitting || isLoading}
                >
                    {isSubmitting ? '...' : isEditing ? <MdEdit/> : <FaPlus/>}
                </button>
            </div>
        </motion.form>
    );
};

export default Form;