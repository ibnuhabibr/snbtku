import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const useAdmin = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isAdmin) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, isAdmin, navigate]);

  return {
    isAdmin,
    isSuperAdmin,
    user,
    isAuthenticated,
  };
};

export const useRequireAdmin = () => {
  const { isAdmin, isAuthenticated } = useAdmin();
  
  if (!isAuthenticated || !isAdmin) {
    throw new Error('Admin access required');
  }
  
  return { isAdmin: true };
};

export const useRequireSuperAdmin = () => {
  const { isSuperAdmin, isAuthenticated } = useAdmin();
  
  if (!isAuthenticated || !isSuperAdmin) {
    throw new Error('Super admin access required');
  }
  
  return { isSuperAdmin: true };
};