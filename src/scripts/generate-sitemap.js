import { writeFileSync } from 'fs';
import { globby } from 'globby';
import prettier from 'prettier';

async function generateSitemap() {
    const prettierConfig = await prettier.resolveConfig('./.prettierrc.js');
    const pages = await globby([
        'src/pages/**/*.tsx',
        '!src/pages/**/_*.tsx',
        '!src/pages/**/[*',
        '!src/pages/**/404.tsx',
        '!src/pages/**/notFound.tsx',
        '!src/pages/api/**/*',
    ]);

    const siteUrl = process.env.VITE_SITE_URL || 'https://yourdomain.com';
    const currentDate = new Date().toISOString();

    const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
                xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
                xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
            ${pages
                .map(page => {
                    const path = page
                        .replace('src/pages', '')
                        .replace('.tsx', '')
                        .replace(/\/index$/, '')
                        .replace(/\[\.{3}.+\]/, '*')
                        .replace(/\[([^\]]+)\]/g, ':$1');
                    
                    const route = path === '' ? '' : path;
                    const priority = getPagePriority(route);
                    const changefreq = getChangeFrequency(route);
                    
                    return `
                        <url>
                            <loc>${siteUrl}${route}</loc>
                            <lastmod>${currentDate}</lastmod>
                            <changefreq>${changefreq}</changefreq>
                            <priority>${priority}</priority>
                        </url>
                    `;
                })
                .join('')}
        </urlset>
    `;

    const formatted = await prettier.format(sitemap, {
        ...prettierConfig,
        parser: 'html'
    });

    writeFileSync('public/sitemap.xml', formatted);
    console.log('Sitemap generated successfully!');
}

function getPagePriority(route) {
    const priorities = {
        '/': '1.0',
        '/home': '0.9',
        '/inicio': '0.9',
        '/post': '0.8',
        default: '0.5'
    };
    
    for (const [key, value] of Object.entries(priorities)) {
        if (route.startsWith(key)) return value;
    }
    return priorities.default;
}

function getChangeFrequency(route) {
    const frequencies = {
        '/': 'daily',
        '/home': 'daily',
        '/inicio': 'daily',
        '/post': 'weekly',
        default: 'monthly'
    };
    
    for (const [key, value] of Object.entries(frequencies)) {
        if (route.startsWith(key)) return value;
    }
    return frequencies.default;
}

generateSitemap();