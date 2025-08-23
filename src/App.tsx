import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import OfflineStatus from "@/components/OfflineStatus";

// Import PWA service
import { initPWA } from "@/lib/pwa-service";

// Lazy loaded pages for better performance
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const StudyJourney = lazy(() => import("./pages/StudyJourney"));
const PracticeZone = lazy(() => import("./pages/PracticeZone"));
const TryOut = lazy(() => import("./pages/TryOut"));
const TryoutPackages = lazy(() => import("./pages/TryoutPackages"));
const TryoutDemo = lazy(() => import("./pages/TryoutDemo"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const MateriBelajar = lazy(() => import("./pages/MateriBelajar"));
const MateriSubtes = lazy(() => import("./pages/MateriSubtes"));
const PracticeSubtes = lazy(() => import("./pages/PracticeSubtes"));
const PracticeSession = lazy(() => import("./pages/PracticeSession"));
const RangkumanSubtes = lazy(() => import("./pages/RangkumanSubtes"));
const AnalisisPotensi = lazy(() => import("./pages/AnalisisPotensi"));
const Profile = lazy(() => import("./pages/Profile"));
const Gamification = lazy(() => import("./pages/Gamification"));
const GamificationSimple = lazy(() => import("./pages/GamificationSimple"));
const Shop = lazy(() => import("./pages/Shop"));
const DukungKami = lazy(() => import("./pages/DukungKami"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Community = lazy(() => import("./pages/Community"));
const SocialPage = lazy(() => import("./pages/SocialPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin Pages - lazy loaded
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ContentManagement = lazy(() => import("./pages/admin/ContentManagement"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const TryoutManagement = lazy(() => import("./pages/admin/TryoutManagement"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in newer versions)
      retry: 1,
    },
  },
});

// App routing component with analytics tracking
const AppRoutes = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Initialize PWA features
    initPWA();
    
    // Track page view on route change and scroll to top
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      
      // Only track in production
      if (import.meta.env.PROD) {
        try {
          // Simple analytics tracking
          const path = location.pathname + location.search;
          console.log(`📊 Page view: ${path}`);
        } catch (error) {
          console.error('Analytics error:', error);
        }
      }
    }
  }, [location]);

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <Navigation />
        
        <main className="flex-grow">
          <Suspense fallback={
            <div className="flex items-center justify-center h-[50vh]">
              <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/study-journey" element={
                <ProtectedRoute>
                  <StudyJourney />
                </ProtectedRoute>
              } />
              <Route path="/practice" element={
                <ProtectedRoute>
                  <PracticeZone />
                </ProtectedRoute>
              } />
              <Route path="/practice/:subtestId" element={
                <ProtectedRoute>
                  <PracticeSubtes />
                </ProtectedRoute>
              } />
              <Route path="/practice/:subtestId/:topicId" element={
                <ProtectedRoute>
                  <PracticeSession />
                </ProtectedRoute>
              } />
              <Route path="/tryout" element={
                <ProtectedRoute>
                  <TryOut />
                </ProtectedRoute>
              } />
              <Route path="/tryout/packages" element={
                <ProtectedRoute>
                  <TryoutPackages />
                </ProtectedRoute>
              } />
              <Route path="/tryout/demo" element={
                <ProtectedRoute>
                  <TryoutDemo />
                </ProtectedRoute>
              } />
              <Route path="/leaderboard" element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              } />
              <Route path="/materi" element={
                <ProtectedRoute>
                  <MateriBelajar />
                </ProtectedRoute>
              } />
              <Route path="/materi/:subtestId" element={
                <ProtectedRoute>
                  <MateriSubtes />
                </ProtectedRoute>
              } />
              <Route path="/materi/:subtestId/:materialId" element={
                <ProtectedRoute>
                  <RangkumanSubtes />
                </ProtectedRoute>
              } />
              <Route path="/analisis" element={
                <ProtectedRoute>
                  <AnalisisPotensi />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/gamification" element={
                <ProtectedRoute>
                  <Gamification />
                </ProtectedRoute>
              } />
              <Route path="/gamification-test" element={
                <ProtectedRoute>
                  <GamificationSimple />
                </ProtectedRoute>
              } />
              <Route path="/shop" element={
                <ProtectedRoute>
                  <Shop />
                </ProtectedRoute>
              } />
              <Route path="/community" element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              } />
              <Route path="/social/:id" element={
                <ProtectedRoute>
                  <SocialPage />
                </ProtectedRoute>
              } />
              <Route path="/dukung-kami" element={<DukungKami />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin/content" element={
                <AdminRoute>
                  <ContentManagement />
                </AdminRoute>
              } />
              <Route path="/admin/users" element={
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              } />
              <Route path="/admin/tryouts" element={
                <AdminRoute>
                  <TryoutManagement />
                </AdminRoute>
              } />
              <Route path="/admin/analytics" element={
                <AdminRoute>
                  <Analytics />
                </AdminRoute>
              } />
              <Route path="/admin/settings" element={
                <AdminRoute>
                  <AdminSettings />
                </AdminRoute>
              } />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        
        <Footer />
        
        {/* PWA components */}
        <OfflineStatus />
      </div>
    </ErrorBoundary>
  );
};

// Main App component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
