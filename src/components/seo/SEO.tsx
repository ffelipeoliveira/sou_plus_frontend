import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'profile';
    publishedTime?: string;
    author?: string;
    noIndex?: boolean;
}

export default function SEO({ 
    title = 'SOU+ - Conecte-se com seus colegas',
    description = 'Chat para alunos.',
    keywords = 'chat, messaging, social, real-time communication',
    image = '/default-og-image.png',
    url = typeof window !== 'undefined' ? window.location.href : '',
    type = 'website',
    publishedTime,
    author,
    noIndex = false
}: SEOProps) {
    const siteTitle = 'SOU+';
    const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
    
    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content={author || 'SOU+ Team'} />
            
            {/* Robots Control */}
            {noIndex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow" />
            )}
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content={siteTitle} />
            
            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            
            {/* Canonical URL */}
            <link rel="canonical" href={url} />
            
            {/* Mobile Optimization */}
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            <meta name="theme-color" content="#585299" />
            
            {/* Article Specific Meta Tags */}
            {type === 'article' && publishedTime && (
                <>
                    <meta property="article:published_time" content={publishedTime} />
                    <meta property="article:author" content={author || ''} />
                </>
            )}
            
            {/* Profile Specific Meta Tags */}
            {type === 'profile' && author && (
                <meta property="profile:username" content={author} />
            )}
        </Helmet>
    );
}