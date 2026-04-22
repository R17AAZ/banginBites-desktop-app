import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/api';
import { AuthService } from '../services/auth.service';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  verifyAccount: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const decodeToken = (token: string): any => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  // Load user from storage on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser({
          id: decoded.authId,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
          profile: decoded.profile,
          verified: true,
          status: 'ACTIVE'
        });
      } else {
        localStorage.removeItem('access_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login({ email, password });
      const { accessToken } = response.data;
      
      localStorage.setItem('access_token', accessToken);
      const decoded = decodeToken(accessToken);
      
      setUser({
        id: decoded.authId,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        profile: decoded.profile,
        verified: true,
        status: 'ACTIVE'
      });
      
      toast.success('Welcome back!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: any) => {
    setIsLoading(true);
    try {
      await AuthService.signup(data);
      toast.success('Account created! Please verify your email.');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAccount = async (email: string, oneTimeCode: string) => {
    setIsLoading(true);
    try {
      const response = await AuthService.verifyAccount({ 
        email, 
        oneTimeCode,
        type: 'ACCOUNT_ACTIVATION' 
      });
      const { accessToken } = response.data;
      
      localStorage.setItem('access_token', accessToken);
      const decoded = decodeToken(accessToken);
      
      setUser({
        id: decoded.authId,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        profile: decoded.profile,
        verified: true,
        status: 'ACTIVE'
      });
      
      toast.success('Account verified!');
    } catch (error: any) {
      toast.error(error.message || 'Verification failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, verifyAccount, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
