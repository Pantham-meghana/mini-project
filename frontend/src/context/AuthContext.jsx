// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Renamed from admin to user for clarity
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('survey_token');
    const savedUser = localStorage.getItem('survey_user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (authData) => {
    // We now capture the 'role' field we added to your backend AuthResponse
    const userInfo = {
      id: authData.adminId, // This is your primary ID from backend
      email: authData.email,
      fullName: authData.fullName,
      role: authData.role // CRITICAL: This allows ProtectedRoute to work
    };

    setToken(authData.token);
    setUser(userInfo);
    
    localStorage.setItem('survey_token', authData.token);
    localStorage.setItem('survey_user', JSON.stringify(userInfo));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('survey_token');
    localStorage.removeItem('survey_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      loading, 
      isAuthenticated: !!token 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
