import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Convert+ - Free Online File Converter',
  description = 'Convert PDF, DOCX, images, and more formats instantly. Free, secure, and no registration required.',
  keywords = 'file converter, pdf converter, document converter, free converter, online converter',
  image = '/og-image.png',
  url = 'https://conversordearquivos.online',
  type = 'website',
  noIndex = false,
}) => {
  const siteTitle = title.includes('Convert+') ? title : `${title} | Convert+`;

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Convert+" />
      
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
      )}
      
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Convert+" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      <link rel="canonical" href={url} />
      
      <meta httpEquiv="Content-Language" content="en" />
      
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Helmet>
  );
};