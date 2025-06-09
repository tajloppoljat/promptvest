import { useState, useEffect } from "react";

const AUTH_KEY = "promptcraft_authenticated";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authData = localStorage.getItem(AUTH_KEY);
      if (authData) {
        try {
          const { timestamp } = JSON.parse(authData);
          const now = Date.now();
          
          if (now - timestamp < SESSION_DURATION) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem(AUTH_KEY);
            setIsAuthenticated(false);
          }
        } catch {
          localStorage.removeItem(AUTH_KEY);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const authenticate = () => {
    const authData = {
      timestamp: Date.now(),
      authenticated: true
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    authenticate,
    logout
  };
}