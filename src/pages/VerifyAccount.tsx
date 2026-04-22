import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ShieldCheck, ArrowRight, RefreshCcw } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../services/auth.service';
import { toast } from 'react-hot-toast';

import logo from '../assets/logo.jpg';

const VerifyAccount: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const { verifyAccount, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (user && user.verified) {
      navigate(`/${user.role.toLowerCase()}/dashboard`);
    }
  }, [user, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyAccount(email, otp);
      // AuthContext handles state and toast
    } catch (error) {
      console.error('Verification failed', error);
    }
  };

  const handleResend = async () => {
    try {
      await AuthService.resendOtp({ 
        email, 
        type: 'ACCOUNT_ACTIVATION' 
      });
      toast.success('OTP resent successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-50 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-brand/20 shadow-xl shadow-brand/5 p-2 bg-white">
              <img src={logo} alt="Bangin' Bites Logo" className="w-full h-full object-cover rounded-2xl" />
            </div>
          </div>
          <h1 className="text-4xl font-bold font-heading text-brand tracking-tighter uppercase">
            BANGIN' <span className="text-neutral-900">BITES</span>
          </h1>
          <p className="text-neutral-500 font-sans mt-2">Verify your account to get started</p>
        </div>

        <Card className="border border-neutral-100">
          <CardHeader>
            <div className="w-12 h-12 bg-brand/10 text-brand rounded-full flex items-center justify-center mb-4">
              <ShieldCheck size={24} />
            </div>
            <CardTitle>Enter OTP</CardTitle>
            <CardDescription>
              We've sent a 6-digit verification code to <span className="font-semibold text-neutral-900">{email}</span>
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleVerify}>
            <CardContent className="space-y-4">
              <Input 
                label="Verification Code" 
                placeholder="123456" 
                className="text-center text-2xl tracking-[0.5em] font-bold"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <p className="text-xs text-neutral-500 text-center">
                Please check your inbox and spam folder.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full" 
                isLoading={isLoading}
                disabled={otp.length !== 6}
              >
                Verify Account
                <ArrowRight size={18} className="ml-2" />
              </Button>
              
              <button 
                type="button"
                className="flex items-center justify-center gap-2 text-sm font-medium text-neutral-600 hover:text-brand transition-colors"
                onClick={handleResend}
              >
                <RefreshCcw size={16} />
                Resend Code
              </button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default VerifyAccount;
