// Analytics and monitoring utilities

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

class Analytics {
  private isEnabled: boolean;
  private userId: string | null = null;

  constructor() {
    this.isEnabled = import.meta.env.PROD && !!import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
  }

  // Initialize analytics with user ID
  init(userId?: string) {
    this.userId = userId || null;
    
    if (this.isEnabled && typeof window !== 'undefined') {
      // Initialize Google Analytics
      this.initGoogleAnalytics();
      
      // Track page view
      this.trackPageView(window.location.pathname);
    }
  }

  private initGoogleAnalytics() {
    const gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
    if (!gaId) return;

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    
    window.gtag('js', new Date());
    window.gtag('config', gaId, {
      user_id: this.userId,
      send_page_view: false, // We'll handle this manually
    });
  }

  // Track page views
  trackPageView(path: string, title?: string) {
    if (!this.isEnabled) return;

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title || document.title,
        user_id: this.userId,
      });
    }

    console.log('📊 Page View:', { path, title, userId: this.userId });
  }

  // Track custom events
  trackEvent(event: AnalyticsEvent) {
    if (!this.isEnabled) return;

    const eventData = {
      ...event.properties,
      user_id: event.userId || this.userId,
      timestamp: Date.now(),
    };

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.name, eventData);
    }

    console.log('📊 Event:', event.name, eventData);
  }

  // Track user interactions
  trackUserAction(action: string, category: string, properties?: Record<string, any>) {
    this.trackEvent({
      name: 'user_action',
      properties: {
        action,
        category,
        ...properties,
      },
    });
  }

  // Track learning progress
  trackLearningProgress(data: {
    subject: string;
    topic: string;
    progress: number;
    timeSpent: number;
    score?: number;
  }) {
    this.trackEvent({
      name: 'learning_progress',
      properties: data,
    });
  }

  // Track quiz/tryout completion
  trackQuizCompletion(data: {
    quizId: string;
    quizType: 'practice' | 'tryout';
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number;
    subject: string;
  }) {
    this.trackEvent({
      name: 'quiz_completed',
      properties: data,
    });
  }

  // Track performance metrics
  trackPerformance(metric: PerformanceMetric) {
    if (!this.isEnabled) return;

    this.trackEvent({
      name: 'performance_metric',
      properties: {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_unit: metric.unit,
        timestamp: metric.timestamp,
      },
    });
  }

  // Track errors
  trackError(error: Error, context?: Record<string, any>) {
    if (!this.isEnabled) return;

    this.trackEvent({
      name: 'error',
      properties: {
        error_message: error.message,
        error_stack: error.stack,
        error_name: error.name,
        ...context,
      },
    });
  }

  // Set user properties
  setUserProperties(properties: Record<string, any>) {
    if (!this.isEnabled) return;

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', import.meta.env.VITE_GOOGLE_ANALYTICS_ID, {
        custom_map: properties,
      });
    }
  }

  // Update user ID
  setUserId(userId: string) {
    this.userId = userId;
    
    if (this.isEnabled && typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', import.meta.env.VITE_GOOGLE_ANALYTICS_ID, {
        user_id: userId,
      });
    }
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private analytics: Analytics;

  constructor(analytics: Analytics) {
    this.analytics = analytics;
  }

  static getInstance(analytics: Analytics): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor(analytics);
    }
    return PerformanceMonitor.instance;
  }

  // Measure and track page load time
  trackPageLoadTime() {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.fetchStart;
          
          this.analytics.trackPerformance({
            name: 'page_load_time',
            value: loadTime,
            unit: 'ms',
            timestamp: Date.now(),
          });
        }
      }, 0);
    });
  }

  // Track Core Web Vitals
  trackWebVitals() {
    if (typeof window === 'undefined') return;

    // Track LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this.analytics.trackPerformance({
        name: 'largest_contentful_paint',
        value: lastEntry.startTime,
        unit: 'ms',
        timestamp: Date.now(),
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Track FID (First Input Delay)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.analytics.trackPerformance({
          name: 'first_input_delay',
          value: entry.processingStart - entry.startTime,
          unit: 'ms',
          timestamp: Date.now(),
        });
      });
    }).observe({ entryTypes: ['first-input'] });
  }
}

// Global analytics instance
export const analytics = new Analytics();
export const performanceMonitor = PerformanceMonitor.getInstance(analytics);

// Declare global gtag function
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Helper hooks for React components
export const useAnalytics = () => {
  return {
    trackEvent: (event: AnalyticsEvent) => analytics.trackEvent(event),
    trackUserAction: (action: string, category: string, properties?: Record<string, any>) => 
      analytics.trackUserAction(action, category, properties),
    trackLearningProgress: (data: Parameters<typeof analytics.trackLearningProgress>[0]) => 
      analytics.trackLearningProgress(data),
    trackQuizCompletion: (data: Parameters<typeof analytics.trackQuizCompletion>[0]) => 
      analytics.trackQuizCompletion(data),
  };
};