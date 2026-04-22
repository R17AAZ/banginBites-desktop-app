import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthService } from '../services/auth.service';
import { toast } from 'react-hot-toast';
import logo from '../assets/logo.jpg';

const ResetPassword: React.FC = () => {
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/forgot-password');
        }
    }, [token, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error('Passwords do not match');
        }

        try {
            setIsLoading(true);
            const res = await AuthService.resetPassword({ 
                newPassword: passwordData.newPassword 
            }, token);

            if (res.success) {
                toast.success('Password reset successfully');
                setIsSuccess(true);
            } else {
                toast.error(res.message || 'Failed to reset password');
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-neutral-50 p-6">
                <div className="w-full max-w-md text-center">
                    <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-xl space-y-6">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-500 animate-in zoom-in-50 duration-500">
                                <CheckCircle2 size={40} />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-900 font-heading">Password Reset Complete</h2>
                        <p className="text-neutral-500 font-sans">
                            Your password has been successfully updated. You can now use your new password to sign in.
                        </p>
                        <Button 
                            className="w-full py-6 rounded-xl font-bold"
                            onClick={() => navigate('/login')}
                        >
                            Sign In Now
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

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
                    <p className="text-neutral-500 font-sans mt-2">Create new password</p>
                </div>

                <Card className="border border-neutral-100 font-sans">
                    <CardHeader>
                        <CardTitle>Set New Password</CardTitle>
                        <CardDescription>Enter a new, strong password for your account.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <Input 
                                label="New Password" 
                                name="newPassword"
                                placeholder="••••••••" 
                                type="password" 
                                leftIcon={<Lock size={18} />}
                                value={passwordData.newPassword}
                                onChange={handleChange}
                                required
                            />
                            <Input 
                                label="Confirm New Password" 
                                name="confirmPassword"
                                placeholder="••••••••" 
                                type="password" 
                                leftIcon={<Lock size={18} />}
                                value={passwordData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </CardContent>
                        <CardFooter>
                            <Button 
                                type="submit" 
                                className="w-full" 
                                isLoading={isLoading}
                            >
                                Reset Password
                                <ArrowRight size={18} className="ml-2" />
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;
