import { NavigateFunction } from 'react-router-dom';
import { User } from 'firebase/auth';

/**
 * Handles authentication-aware navigation
 * If user is logged in, redirects to dashboard
 * If user is not logged in, redirects to the specified auth page
 */
export const handleAuthNavigation = (
  currentUser: User | null,
  navigate: NavigateFunction,
  authPage: 'login' | 'register' = 'register'
) => {
  if (currentUser) {
    navigate('/dashboard');
  } else {
    navigate(`/${authPage}`);
  }
};

/**
 * Handles navigation for learning-related actions
 * If user is logged in, redirects to dashboard
 * If user is not logged in, redirects to register page
 */
export const handleStartLearning = (
  currentUser: User | null,
  navigate: NavigateFunction
) => {
  handleAuthNavigation(currentUser, navigate, 'register');
};

/**
 * Handles navigation for registration-related actions
 * If user is logged in, redirects to dashboard
 * If user is not logged in, redirects to register page
 */
export const handleRegisterNavigation = (
  currentUser: User | null,
  navigate: NavigateFunction
) => {
  handleAuthNavigation(currentUser, navigate, 'register');
};

/**
 * Handles navigation for login-related actions
 * If user is logged in, redirects to dashboard
 * If user is not logged in, redirects to login page
 */
export const handleLoginNavigation = (
  currentUser: User | null,
  navigate: NavigateFunction
) => {
  handleAuthNavigation(currentUser, navigate, 'login');
};