// SEO utilities and meta tag management

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

class SEOManager {
  private defaultConfig: SEOConfig = {
    title: 'SNBTKU - Platform Pembelajaran SNBT Terbaik',
    description: 'Platform pembelajaran online terlengkap untuk persiapan SNBT dengan fitur try out, materi lengkap, dan analitik pembelajaran yang canggih.',
    keywords: [
      'SNBT',
      'Seleksi Nasional Berdasarkan Tes',
      'UTBK',
      'PTN',
      'Try Out',
      'Pembelajaran Online',
      'Persiapan SNBT',
      'Soal SNBT',
      'Materi SNBT',
      'Platform Edukasi'
    ],
    image: '/og-image.jpg',
    url: 'https://snbtku.com',
    type: 'website',
    author: 'SNBTKU Team'
  };

  // Update document title
  setTitle(title: string, includeAppName: boolean = true) {
    if (typeof document === 'undefined') return;
    
    const fullTitle = includeAppName ? `${title} | SNBTKU` : title;
    document.title = fullTitle;
    
    // Update Open Graph title
    this.updateMetaTag('property', 'og:title', fullTitle);
    this.updateMetaTag('name', 'twitter:title', fullTitle);
  }

  // Update meta description
  setDescription(description: string) {
    if (typeof document === 'undefined') return;
    
    this.updateMetaTag('name', 'description', description);
    this.updateMetaTag('property', 'og:description', description);
    this.updateMetaTag('name', 'twitter:description', description);
  }

  // Update keywords
  setKeywords(keywords: string[]) {
    if (typeof document === 'undefined') return;
    
    this.updateMetaTag('name', 'keywords', keywords.join(', '));
  }

  // Update Open Graph image
  setImage(imageUrl: string) {
    if (typeof document === 'undefined') return;
    
    const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${this.defaultConfig.url}${imageUrl}`;
    
    this.updateMetaTag('property', 'og:image', fullImageUrl);
    this.updateMetaTag('name', 'twitter:image', fullImageUrl);
    this.updateMetaTag('property', 'og:image:alt', 'SNBTKU - Platform Pembelajaran SNBT');
  }

  // Update canonical URL
  setCanonicalUrl(url: string) {
    if (typeof document === 'undefined') return;
    
    const fullUrl = url.startsWith('http') ? url : `${this.defaultConfig.url}${url}`;
    
    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = fullUrl;
    
    // Update Open Graph URL
    this.updateMetaTag('property', 'og:url', fullUrl);
  }

  // Set complete SEO configuration
  setSEO(config: Partial<SEOConfig>) {
    const fullConfig = { ...this.defaultConfig, ...config };
    
    this.setTitle(fullConfig.title, false);
    this.setDescription(fullConfig.description);
    
    if (fullConfig.keywords) {
      this.setKeywords(fullConfig.keywords);
    }
    
    if (fullConfig.image) {
      this.setImage(fullConfig.image);
    }
    
    if (fullConfig.url) {
      this.setCanonicalUrl(fullConfig.url);
    }
    
    // Set additional Open Graph properties
    this.updateMetaTag('property', 'og:type', fullConfig.type || 'website');
    this.updateMetaTag('property', 'og:site_name', 'SNBTKU');
    
    if (fullConfig.author) {
      this.updateMetaTag('name', 'author', fullConfig.author);
    }
    
    if (fullConfig.publishedTime) {
      this.updateMetaTag('property', 'article:published_time', fullConfig.publishedTime);
    }
    
    if (fullConfig.modifiedTime) {
      this.updateMetaTag('property', 'article:modified_time', fullConfig.modifiedTime);
    }
    
    // Twitter Card
    this.updateMetaTag('name', 'twitter:card', 'summary_large_image');
    this.updateMetaTag('name', 'twitter:site', '@snbtku');
  }

  // Add structured data (JSON-LD)
  addStructuredData(data: StructuredData) {
    if (typeof document === 'undefined') return;
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  // Remove structured data
  removeStructuredData() {
    if (typeof document === 'undefined') return;
    
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach(script => script.remove());
  }

  // Helper method to update meta tags
  private updateMetaTag(attribute: string, value: string, content: string) {
    if (typeof document === 'undefined') return;
    
    let metaTag = document.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute(attribute, value);
      document.head.appendChild(metaTag);
    }
    metaTag.content = content;
  }
}

// Predefined SEO configurations for different pages
export const seoConfigs = {
  home: {
    title: 'SNBTKU - Platform Pembelajaran SNBT Terbaik',
    description: 'Platform pembelajaran online terlengkap untuk persiapan SNBT dengan fitur try out, materi lengkap, dan analitik pembelajaran yang canggih.',
    url: '/'
  },
  dashboard: {
    title: 'Dashboard',
    description: 'Dashboard pembelajaran SNBT dengan analitik progress, statistik, dan rekomendasi belajar personal.',
    url: '/dashboard'
  },
  tryout: {
    title: 'Try Out SNBT',
    description: 'Simulasi ujian SNBT dengan soal-soal berkualitas tinggi dan sistem penilaian yang akurat.',
    url: '/tryout'
  },
  materials: {
    title: 'Materi Pembelajaran',
    description: 'Koleksi lengkap materi pembelajaran SNBT untuk semua mata pelajaran dengan penjelasan yang mudah dipahami.',
    url: '/materials'
  },
  leaderboard: {
    title: 'Leaderboard',
    description: 'Papan peringkat siswa terbaik SNBTKU. Lihat posisi Anda dan bersaing dengan siswa lain.',
    url: '/leaderboard'
  },
  community: {
    title: 'Komunitas SNBTKU',
    description: 'Bergabung dengan komunitas SNBTKU untuk diskusi, sharing tips, dan mendapat update terbaru.',
    url: '/community'
  },
  profile: {
    title: 'Profil Saya',
    description: 'Kelola profil dan pengaturan akun SNBTKU Anda.',
    url: '/profile'
  }
};

// Structured data templates
export const structuredDataTemplates = {
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SNBTKU',
    description: 'Platform pembelajaran online untuk persiapan SNBT',
    url: 'https://snbtku.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://snbtku.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  },
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SNBTKU',
    description: 'Platform pembelajaran online terbaik untuk persiapan SNBT',
    url: 'https://snbtku.com',
    logo: 'https://snbtku.com/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+62-xxx-xxxx-xxxx',
      contactType: 'customer service',
      availableLanguage: 'Indonesian'
    },
    sameAs: [
      'https://www.instagram.com/snbtku',
      'https://www.youtube.com/snbtku',
      'https://www.tiktok.com/@snbtku'
    ]
  },
  educationalOrganization: {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'SNBTKU',
    description: 'Platform pembelajaran online untuk persiapan SNBT',
    url: 'https://snbtku.com',
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      name: 'SNBT Preparation Course',
      description: 'Comprehensive SNBT preparation program'
    }
  }
};

// Global SEO manager instance
export const seoManager = new SEOManager();

// React hook for SEO management
export const useSEO = () => {
  const setSEO = (config: Partial<SEOConfig>) => {
    seoManager.setSEO(config);
  };
  
  const setPageSEO = (pageKey: keyof typeof seoConfigs) => {
    const config = seoConfigs[pageKey];
    if (config) {
      seoManager.setSEO(config);
    }
  };
  
  const addStructuredData = (data: StructuredData) => {
    seoManager.addStructuredData(data);
  };
  
  const removeStructuredData = () => {
    seoManager.removeStructuredData();
  };
  
  return {
    setSEO,
    setPageSEO,
    addStructuredData,
    removeStructuredData,
    setTitle: seoManager.setTitle.bind(seoManager),
    setDescription: seoManager.setDescription.bind(seoManager),
    setKeywords: seoManager.setKeywords.bind(seoManager),
    setImage: seoManager.setImage.bind(seoManager),
    setCanonicalUrl: seoManager.setCanonicalUrl.bind(seoManager)
  };
};