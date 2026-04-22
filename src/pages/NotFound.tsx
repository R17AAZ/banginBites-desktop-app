import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { HelpCircle, ArrowLeft, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBack = () => {
    if (user) {
      navigate(`/${user.role.toLowerCase()}/dashboard`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="relative inline-block"
        >
          <div className="w-32 h-32 bg-brand/10 rounded-full flex items-center justify-center mx-auto">
            <HelpCircle size={64} className="text-brand animate-pulse" />
          </div>
          <div className="absolute -top-2 -right-2 bg-neutral-900 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            404 ERROR
          </div>
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black font-heading text-neutral-900 tracking-tight">
            Oops! Food for thought?
          </h1>
          <p className="text-neutral-500 font-sans leading-relaxed">
            The page you're looking for seems to have vanished into thin air. maybe it was too delicious to stay?
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button 
            onClick={() => navigate(-1)} 
            variant="ghost" 
            className="w-full sm:w-auto text-neutral-600 font-bold px-8"
          >
            <ArrowLeft size={18} className="mr-2" />
            Go Back
          </Button>
          <Button 
            onClick={handleBack} 
            className="w-full sm:w-auto px-8 bg-neutral-900 text-white hover:bg-neutral-800"
          >
            <Home size={18} className="mr-2" />
            Return Home
          </Button>
        </div>

        <div className="pt-12">
          <div className="flex items-center justify-center gap-2 text-neutral-300 font-bold tracking-widest text-[10px]">
            <span className="w-8 h-px bg-neutral-200"></span>
            BANGIN' BITES PLATFORM
            <span className="w-8 h-px bg-neutral-200"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
