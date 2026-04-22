import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import logo from '../assets/logo.jpg';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-50 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-brand/20 shadow-xl shadow-brand/5 p-2 bg-white">
              <img src={logo} alt="Bangin' Bites Logo" className="w-full h-full object-cover rounded-2xl" />
            </div>
          </div>
          <h1 className="text-4xl font-bold font-heading text-brand tracking-tighter uppercase">
            BANGIN' <span className="text-neutral-900">BITES</span>
          </h1>
          <p className="text-neutral-500 font-sans mt-2">Sign in to manage your account</p>
        </div>

        <Card className="border border-neutral-100">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <Input 
                label="Email Address" 
                placeholder="name@example.com" 
                type="email" 
                leftIcon={<Mail size={18} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input 
                label="Password" 
                placeholder="••••••••" 
                type="password" 
                leftIcon={<Lock size={18} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-brand focus:ring-brand" />
                  <span className="text-sm text-neutral-600 font-sans group-hover:text-neutral-900 transition-colors">Remember me</span>
                </label>
                <button 
                  type="button" 
                  className="text-sm font-medium text-brand hover:text-brand-600 font-sans"
                  onClick={() => navigate('/forgot-password')}
                >
                  Forgot password?
                </button>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                isLoading={isAuthLoading}
              >
                {!isAuthLoading && <LogIn size={18} className="mr-2" />}
                Sign In
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-sm text-neutral-500 font-sans mt-8">
          Don't have an account? {' '}
          <button 
            type="button"
            className="font-semibold text-brand hover:text-brand-600"
            onClick={() => navigate('/signup')}
          >
            Join the movement
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
