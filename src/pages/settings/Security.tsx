import { useState } from 'react';
import { Lock, Trash2, AlertTriangle } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { AuthService } from '../../services/auth.service';
import toast from 'react-hot-toast';
import { useDialog } from '../../context/DialogContext';
import { useAuth } from '../../context/AuthContext';
import { ChefLoader } from '../../components/ui/LoadingSpinner';

const Security = () => {
  const { logout } = useAuth();
  const { confirm, prompt } = useDialog();
  
  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
      return toast.error('Please fill in all password fields');
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      return toast.error('Passwords do not match');
    }

    try {
      setIsUpdatingPassword(true);
      const res = await AuthService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (res.success) {
        toast.success('Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
      } else {
        toast.error(res.message || 'Failed to update password');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = await confirm({
      title: 'Delete Account?',
      message: 'This action is irreversible. You will lose all your data, order history, and reviews. Are you absolutely sure?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    });

    if (!confirmed) return;

    const password = await prompt({
      title: 'Verify Password',
      message: 'Please enter your password to confirm account deletion.',
      confirmText: 'Delete Permanently',
      inputType: 'password',
      variant: 'danger'
    });

    if (!password) return;

    try {
      setIsDeletingAccount(true);
      const res = await AuthService.deleteAccount({ password });

      if (res.success) {
        toast.success('Account deleted successfully');
        await logout();
      } else {
        toast.error(res.message || 'Failed to delete account');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full p-6 text-left"
    >
      <div className="mb-8 font-sans">
        <h1 className="text-2xl font-bold text-neutral-900 text-left font-heading tracking-tight">Security Settings</h1>
        <p className="text-sm text-neutral-500 mt-1 text-left">Manage your account security and authentication preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-black font-sans">
        {/* Password Change */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 space-y-4 shadow-sm">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
              <Lock size={20} />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">Change Password</h2>
          </div>
          <p className="text-sm text-neutral-500 leading-relaxed">Ensure your account is using a long, random password to stay secure.</p>
          <div className="space-y-4 pt-2">
            <Input
              type="password"
              name="currentPassword"
              label="Current Password"
              placeholder="••••••••"
              className="bg-neutral-50/50"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
            />
            <Input
              type="password"
              name="newPassword"
              label="New Password"
              placeholder="••••••••"
              className="bg-neutral-50/50"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />
            <Input
              type="password"
              name="confirmNewPassword"
              label="Confirm New Password"
              placeholder="••••••••"
              className="bg-neutral-50/50"
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChange}
            />
            <Button 
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword}
                className="w-full mt-2 rounded-xl font-bold py-6 flex items-center justify-center gap-2"
            >
              {isUpdatingPassword ? <ChefLoader size={20} className="text-white" /> : 'Update Password'}
            </Button>
          </div>
        </div>

        {/* Account Deletion */}
        <div className="bg-white p-6 rounded-2xl border border-red-50 space-y-4 shadow-sm">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <Trash2 size={20} />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">Delete Account</h2>
          </div>
          
          <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100 flex gap-3">
            <AlertTriangle className="text-orange-600 shrink-0" size={18} />
            <p className="text-xs text-orange-800 leading-relaxed font-medium">
              Once you delete your account, there is no going back. All your data, orders, and history will be permanently erased.
            </p>
          </div>
          
          <p className="text-sm text-neutral-500 leading-relaxed">
            Deleting your account will remove all of your information from our database. This action is irreversible.
          </p>
          
          <div className="pt-4">
            <Button 
                variant="danger" 
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className="w-full rounded-xl font-bold py-6 bg-red-50 border-red-100 text-red-600 hover:bg-red-100 active:bg-red-200 flex items-center justify-center gap-2"
            >
              {isDeletingAccount ? <ChefLoader size={20} /> : 'Delete Account Permanently'}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Security;
