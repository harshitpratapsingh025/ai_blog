import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const authUser = localStorage.getItem("authUser");
      
      if (token && authUser) {
        setUser(JSON.parse(authUser));
        setIsAuthenticated(true);
      } else {
        setUser(null)
        setIsAuthenticated(false);
      }
    } catch (error) {
      // Token is invalid or expired
      localStorage.removeItem('authToken');
      localStorage.removeItem("authUser");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem("authUser");
      setIsAuthenticated(false);
      setUser(null);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    checkAuthStatus,
  };
};
