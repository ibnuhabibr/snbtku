// Sitemap generator for SNBTKU
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://snbtku.com';
const currentDate = new Date().toISOString().split('T')[0];

// Define all routes with their priorities and change frequencies
const routes = [
  {
    path: '/',
    priority: '1.0',
    changefreq: 'daily',
    lastmod: currentDate
  },
  {
    path: '/dashboard',
    priority: '0.9',
    changefreq: 'daily',
    lastmod: currentDate
  },
  {
    path: '/study-journey',
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: currentDate
  },
  {
    path: '/practice',
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: currentDate
  },
  {
    path: '/tryout',
    priority: '0.9',
    changefreq: 'daily',
    lastmod: currentDate
  },
  {
    path: '/leaderboard',
    priority: '0.7',
    changefreq: 'daily',
    lastmod: currentDate
  },
  {
    path: '/materials',
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: currentDate
  },
  {
    path: '/community',
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: currentDate
  },
  {
    path: '/profile',
    priority: '0.5',
    changefreq: 'monthly',
    lastmod: currentDate
  },
  {
    path: '/settings',
    priority: '0.4',
    changefreq: 'monthly',
    lastmod: currentDate
  },
  {
    path: '/login',
    priority: '0.6',
    changefreq: 'yearly',
    lastmod: currentDate
  },
  {
    path: '/register',
    priority: '0.6',
    changefreq: 'yearly',
    lastmod: currentDate
  },
  {
    path: '/forgot-password',
    priority: '0.3',
    changefreq: 'yearly',
    lastmod: currentDate
  }
];

// Generate XML sitemap
function generateSitemap() {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  
  const xmlFooter = `</urlset>`;
  
  const urlEntries = routes.map(route => {
    return `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  }).join('\n');
  
  const sitemap = `${xmlHeader}\n${urlEntries}\n${xmlFooter}`;
  
  return sitemap;
}

// Generate robots.txt
function generateRobotsTxt() {
  return `User-agent: *
Allow: /

# Disallow admin routes
Disallow: /admin/
Disallow: /api/

# Disallow auth pages from indexing
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /profile
Disallow: /settings

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay
Crawl-delay: 1`;
}

// Write files to public directory
function writeFiles() {
  const publicDir = path.join(__dirname, '..', 'public');
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // Write sitemap.xml
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, generateSitemap(), 'utf8');
  console.log('✅ Generated sitemap.xml');
  
  // Write robots.txt
  const robotsPath = path.join(publicDir, 'robots.txt');
  fs.writeFileSync(robotsPath, generateRobotsTxt(), 'utf8');
  console.log('✅ Generated robots.txt');
  
  console.log(`📊 Generated sitemap with ${routes.length} URLs`);
  console.log(`🔗 Base URL: ${baseUrl}`);
}

// Run the generator
console.log('🚀 Starting sitemap generation...');
writeFiles();
console.log('✨ Sitemap generation completed!');

export {
  generateSitemap,
  generateRobotsTxt,
  writeFiles
};