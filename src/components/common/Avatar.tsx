import { useState } from 'react';
import { FaUser } from 'react-icons/fa';

interface AvatarProps {
    src?: string;
    alt?: string;
    size?: number;
    className?: string;
    initials?: string;
}

export default function Avatar({ src, alt, size = 40, className = '', initials }: AvatarProps) {
    const [error, setError] = useState(false);

    if (error || !src) {
        return (
            <div 
                className={`avatar-fallback ${className}`}
                style={{ 
                    width: size, 
                    height: size,
                    backgroundColor: 'var(--color)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: size * 0.4
                }}
            >
                {initials || <FaUser />}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt || 'Avatar'}
            className={`avatar-image ${className}`}
            style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }}
            onError={() => setError(true)}
        />
    );
}