import { useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { v4 as uuidv4 } from 'uuid';

const AUTH_STORAGE_KEY = 'smart-resume-auth';
const USERS_STORAGE_KEY = 'smart-resume-users';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true
  });

  useEffect(() => {
    // Check for existing authentication on app load
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        if (parsedAuth.user && parsedAuth.user.id) {
          setAuthState({
            user: parsedAuth.user,
            isAuthenticated: true,
            loading: false
          });
          return;
        }
      } catch (error) {
        console.error('Failed to parse stored auth:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    
    setAuthState(prev => ({ ...prev, loading: false }));
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        const authData = {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt
          }
        };
        
        // Store authentication data
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
        
        // Update state
        setAuthState({
          user: authData.user,
          isAuthenticated: true,
          loading: false
        });
        
        console.log('Login successful for user:', authData.user.email);
        return true;
      }
      
      console.log('Login failed: Invalid credentials');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get existing users
      const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
      
      // Check if user already exists
      if (users.find((u: any) => u.email === email)) {
        console.log('Registration failed: Email already exists');
        return false;
      }
      
      // Create new user
      const newUser = {
        id: uuidv4(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        createdAt: new Date().toISOString()
      };
      
      // Save user to localStorage
      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      
      // Create auth data
      const authData = {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          createdAt: newUser.createdAt
        }
      };
      
      // Store authentication data
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      
      // Update state
      setAuthState({
        user: authData.user,
        isAuthenticated: true,
        loading: false
      });
      
      console.log('Registration successful for user:', authData.user.email);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false
    });
    console.log('User logged out');
  };

  return {
    ...authState,
    login,
    register,
    logout
  };
};