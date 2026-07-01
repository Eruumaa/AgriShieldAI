import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext();

// Default system users to populate when empty or offline
const DEFAULT_USERS = [
  { id: 'admin-1', name: 'System Admin', email: 'admin@agrishield.ai', password: 'admin123', role: 'admin', status: 'Active', lastLogin: 'Just now' },
];

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

    // Initialize default users in localStorage if not present
    const stored = localStorage.getItem('agrishield_users');
    if (!stored) {
      localStorage.setItem('agrishield_users', JSON.stringify(DEFAULT_USERS));
    } else {
      try {
        const list = JSON.parse(stored);
        const adminIndex = list.findIndex(u => u.role === 'admin' || u.email === 'admin@agrishield.ai');
        if (adminIndex !== -1 && !list[adminIndex].password) {
          list[adminIndex].password = 'admin123';
          localStorage.setItem('agrishield_users', JSON.stringify(list));
        }
      } catch (e) {
        localStorage.setItem('agrishield_users', JSON.stringify(DEFAULT_USERS));
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if Supabase is configured
    if (isSupabaseConfigured()) {
      try {
        // Query users table
        let queryEmail = email;
        if (email === 'admin') {
          queryEmail = 'admin@agrishield.ai';
        }
        
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', queryEmail);

        if (error) throw error;

        let matchedUser = data?.[0];

        // If admin doesn't exist in Supabase yet, let's auto-create it
        if (!matchedUser && queryEmail === 'admin@agrishield.ai') {
          const { data: newAdmin, error: adminErr } = await supabase
            .from('users')
            .insert([{ name: 'System Admin', email: 'admin@agrishield.ai', password: password || 'admin123', role: 'admin' }])
            .select();
          
          if (adminErr) throw adminErr;
          if (newAdmin && newAdmin.length > 0) matchedUser = newAdmin[0];
        }

        if (matchedUser) {
          // Check password strictly
          if (matchedUser.password !== password) {
            throw new Error('Invalid credentials');
          }
          
          const sessionUser = {
            id: matchedUser.id,
            name: matchedUser.name,
            email: matchedUser.email,
            role: matchedUser.role,
            avatar_url: matchedUser.avatar_url || null,
            status: 'Active',
            lastLogin: 'Just now'
          };
          
          setUser(sessionUser);
          localStorage.setItem('agrishield_session', JSON.stringify(sessionUser));
          return sessionUser;
        } else {
          throw new Error('User not found. Please register.');
        }
      } catch (err) {
        // If it is a credentials/user error, throw it immediately (do not fall back to local)
        if (err.message === 'User not found. Please register.' || err.message === 'Invalid credentials') {
          throw err;
        }
        console.warn("Supabase auth failed, falling back to local:", err.message);
      }
    }

    // Fallback to localStorage auth
    const usersList = JSON.parse(localStorage.getItem('agrishield_users') || JSON.stringify(DEFAULT_USERS));
    let matchedUser = null;

    if (email === 'admin' || email === 'admin@agrishield.ai') {
      matchedUser = usersList.find(u => u.role === 'admin') || DEFAULT_USERS[0];
    } else {
      matchedUser = usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (!matchedUser) {
      throw new Error('User not found. Please register.');
    }

    if (matchedUser.password !== password) {
      throw new Error('Invalid credentials');
    }

    const updatedList = usersList.map(u => {
      if (u.email.toLowerCase() === matchedUser.email.toLowerCase()) {
        return { ...u, status: 'Active', lastLogin: 'Just now' };
      }
      return u;
    });
    localStorage.setItem('agrishield_users', JSON.stringify(updatedList));

    const finalUser = { ...matchedUser, status: 'Active', lastLogin: 'Just now' };
    setUser(finalUser);
    localStorage.setItem('agrishield_session', JSON.stringify(finalUser));
    return finalUser;
  };

  const signup = async (name, email, password) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (!email || !password || !name) throw new Error('Missing fields');

    // Check if Supabase is configured
    if (isSupabaseConfigured()) {
      try {
        // Check if email already registered in Supabase
        const { data: existing, error: checkErr } = await supabase
          .from('users')
          .select('email')
          .eq('email', email);

        if (checkErr) throw checkErr;
        if (existing && existing.length > 0) {
          throw new Error('Email already registered');
        }

        // Insert new user
        const { data, error } = await supabase
          .from('users')
          .insert([{ name, email, password, role: 'user' }])
          .select();

        if (error) throw error;

        if (data && data.length > 0) {
          const sessionUser = {
            id: data[0].id,
            name: data[0].name,
            email: data[0].email,
            role: data[0].role,
            avatar_url: data[0].avatar_url || null,
            status: 'Active',
            lastLogin: 'Just now'
          };
          setUser(sessionUser);
          localStorage.setItem('agrishield_session', JSON.stringify(sessionUser));
          return sessionUser;
        }
      } catch (err) {
        console.error("Supabase signup failed:", err.message);
        throw err; // Throw the error so the user knows exactly why Supabase rejected the registration
      }
    }

    // Fallback to localStorage signup
    const usersList = JSON.parse(localStorage.getItem('agrishield_users') || JSON.stringify(DEFAULT_USERS));
    
    if (usersList.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email already registered');
    }

    const newUser = { 
      id: `user-${Date.now()}`, 
      email, 
      name, 
      password,
      role: 'user', 
      status: 'Active', 
      lastLogin: 'Just now' 
    };

    usersList.push(newUser);
    localStorage.setItem('agrishield_users', JSON.stringify(usersList));

    setUser(newUser);
    localStorage.setItem('agrishield_session', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agrishield_session');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, signup, logout, loading, isAdmin: user?.role === 'admin' }}>
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
