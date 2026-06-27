import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session on mount
    const savedSession = localStorage.getItem('agrishield_session');
    if (savedSession) {
      try {
        setUser(JSON.parse(savedSession));
      } catch (e) {
        console.error("Failed to parse session", e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    let mockUser = null;
    if (email === 'admin' || email === 'admin@agrishield.ai') {
      mockUser = { id: 'admin-1', email: 'admin@agrishield.ai', name: 'System Admin', role: 'admin' };
    } else if (email && password) {
      mockUser = { id: 'user-1', email: email, name: email.split('@')[0] || 'User', role: 'user' };
    } else {
      throw new Error('Invalid credentials');
    }
    setUser(mockUser);
    localStorage.setItem('agrishield_session', JSON.stringify(mockUser));
    return mockUser;
  };

  const signup = async (name, email, password) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (!email || !password || !name) throw new Error('Missing fields');
    const newUser = { id: `user-${Date.now()}`, email, name, role: 'user' };
    setUser(newUser);
    localStorage.setItem('agrishield_session', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agrishield_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
