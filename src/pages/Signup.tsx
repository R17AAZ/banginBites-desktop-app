import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Mail, Lock, User, Phone, MapPin, ChefHat, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types/api';

import logo from '../assets/logo.jpg';

const Signup: React.FC = () => {
  const [role, setRole] = useState<Role>('BUYER');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return; // Handled by UI validation usually, but good to have
    }

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        role: role,
      });
      navigate(`/verify?email=${encodeURIComponent(formData.email)}`);
    } catch (error) {
      console.error('Signup failed', error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-50 p-6">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-brand/20 shadow-xl shadow-brand/5 p-2 bg-white">
              <img src={logo} alt="Bangin' Bites Logo" className="w-full h-full object-cover rounded-2xl" />
            </div>
          </div>
          <h1 className="text-4xl font-bold font-heading text-brand tracking-tighter uppercase">
            BANGIN' <span className="text-neutral-900">BITES</span>
          </h1>
          <p className="text-neutral-500 font-sans mt-2">Join the movement of local food lovers</p>
        </div>

        <Card className="border border-neutral-100">
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Join as a buyer to order food or a seller to start your kitchen</CardDescription>
          </CardHeader>
          
          <div className="px-6 pb-2">
            <div className="grid grid-cols-2 gap-4 p-1 bg-neutral-100 rounded-xl">
              <button
                type="button"
                onClick={() => setRole('BUYER')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  role === 'BUYER' 
                    ? 'bg-white text-brand shadow-sm' 
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <ShoppingBag size={18} />
                Buyer
              </button>
              <button
                type="button"
                onClick={() => setRole('SELLER')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  role === 'SELLER' 
                    ? 'bg-white text-brand shadow-sm' 
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <ChefHat size={18} />
                Seller
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  name="name"
                  label="Full Name" 
                  placeholder="John Doe" 
                  leftIcon={<User size={18} />}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input 
                  name="email"
                  label="Email Address" 
                  placeholder="name@example.com" 
                  type="email" 
                  leftIcon={<Mail size={18} />}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  name="phone"
                  label="Phone Number" 
                  placeholder="+44 7000 000000" 
                  leftIcon={<Phone size={18} />}
                  value={formData.phone}
                  onChange={handleChange}
                />
                <Input 
                  name="address"
                  label="Primary Address" 
                  placeholder="Street, City, Postcode" 
                  leftIcon={<MapPin size={18} />}
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  name="password"
                  label="Password" 
                  placeholder="••••••••" 
                  type="password" 
                  leftIcon={<Lock size={18} />}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Input 
                  name="confirmPassword"
                  label="Confirm Password" 
                  placeholder="••••••••" 
                  type="password" 
                  leftIcon={<Lock size={18} />}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full" 
                isLoading={isLoading}
              >
                Create Account
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <p className="text-center text-sm text-neutral-500 font-sans">
                Already have an account? {' '}
                <button 
                  type="button"
                  className="font-semibold text-brand hover:text-brand-600"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
