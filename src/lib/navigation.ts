import { NavigateFunction } from 'react-router-dom';

/**
 * Handles authentication-aware navigation
 * If user is logged in, redirects to dashboard
 * If user is not logged in, redirects to the specified auth page
 */
export const handleAuthNavigation = (
  isAuthenticated: boolean,
  navigate: NavigateFunction,
  authPage: 'login' | 'register' = 'register'
) => {
  if (isAuthenticated) {
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
  isAuthenticated: boolean,
  navigate: NavigateFunction
) => {
  handleAuthNavigation(isAuthenticated, navigate, 'register');
};

/**
 * Handles navigation for registration-related actions
 * If user is logged in, redirects to dashboard
 * If user is not logged in, redirects to register page
 */
export const handleRegisterNavigation = (
  isAuthenticated: boolean,
  navigate: NavigateFunction
) => {
  handleAuthNavigation(isAuthenticated, navigate, 'register');
};

/**
 * Handles navigation for login-related actions
 * If user is logged in, redirects to dashboard
 * If user is not logged in, redirects to login page
 */
export const handleLoginNavigation = (
  isAuthenticated: boolean,
  navigate: NavigateFunction
) => {
  handleAuthNavigation(isAuthenticated, navigate, 'login');
};