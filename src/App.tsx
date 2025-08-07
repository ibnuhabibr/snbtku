import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import StudyJourney from "./pages/StudyJourney";
import PracticeZone from "./pages/PracticeZone";
import TryOut from "./pages/TryOut";
import TryoutDemo from "./pages/TryoutDemo";
import Leaderboard from "./pages/Leaderboard";
import MateriBelajar from "./pages/MateriBelajar";
import MateriSubtes from "./pages/MateriSubtes";
import PracticeSubtes from "./pages/PracticeSubtes";
import PracticeSession from "./pages/PracticeSession";
import RangkumanSubtes from "./pages/RangkumanSubtes";
import AnalisisPotensi from "./pages/AnalisisPotensi";
import Profile from "./pages/Profile";
import Gamification from "./pages/Gamification";
import Shop from "./pages/Shop";
import DukungKami from "./pages/DukungKami";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ContentManagement from "./pages/admin/ContentManagement";
import UserManagement from "./pages/admin/UserManagement";
import TryoutManagement from "./pages/admin/TryoutManagement";
import Analytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ErrorBoundary>
          <AuthProvider>
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
            <Route path="/materi-belajar" element={
              <ProtectedRoute>
                <MateriBelajar />
              </ProtectedRoute>
            } />
            <Route path="/materi-belajar/:subtestId" element={
              <ProtectedRoute>
                <MateriSubtes />
              </ProtectedRoute>
            } />
            <Route path="/rangkuman/:subtesId" element={
              <ProtectedRoute>
                <RangkumanSubtes />
              </ProtectedRoute>
            } />
            <Route path="/analisis-potensi" element={
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
            <Route path="/toko" element={
              <ProtectedRoute>
                <Shop />
              </ProtectedRoute>
            } />
            <Route path="/dukungkami" element={<DukungKami />} />

          <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/community" element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/content" element={
              <ProtectedRoute>
                <ContentManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/tryout" element={
              <ProtectedRoute>
                <TryoutManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute>
                <AdminSettings />
              </ProtectedRoute>
            } />

             <Route path="*" element={<NotFound />} />
          </Routes>
          </AuthProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
