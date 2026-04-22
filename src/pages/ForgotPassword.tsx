import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/auth.service';
import { toast } from 'react-hot-toast';
import logo from '../assets/logo.jpg';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        try {
            setIsLoading(true);
            const res = await AuthService.forgetPassword(email);
            if (res.success) {
                toast.success('OTP sent to your email');
                navigate(`/verify-reset-otp?email=${encodeURIComponent(email)}`);
            } else {
                toast.error(res.message || 'Failed to send OTP');
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
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
                    <p className="text-neutral-500 font-sans mt-2">Reset your account password</p>
                </div>

                <Card className="border border-neutral-100 font-sans">
                    <CardHeader>
                        <CardTitle>Forgot Password?</CardTitle>
                        <CardDescription>Enter your email address and we'll send you a code to reset your password.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
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
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button 
                                type="submit" 
                                className="w-full" 
                                isLoading={isLoading}
                            >
                                Send Reset Code
                                <ArrowRight size={18} className="ml-2" />
                            </Button>
                            
                            <button 
                                type="button"
                                className="flex items-center justify-center gap-2 text-sm font-medium text-neutral-600 hover:text-brand transition-colors"
                                onClick={() => navigate('/login')}
                            >
                                <ArrowLeft size={16} />
                                Back to Login
                            </button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;
