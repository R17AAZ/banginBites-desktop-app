import React, { useEffect, useState } from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import { FavoriteService } from '../../services/favorite.service';
import { IDish } from '../../types/api';
import { DishCard } from '../../components/ui/DishCard';
import { Button } from '../../components/ui/Button';
import { useAppDispatch } from '../../store/hooks';
import { setFavorites } from '../../store/slices/favoriteSlice';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChefLoader } from '../../components/ui/LoadingSpinner';

const Favorites: React.FC = () => {
    const [favorites, setFavoritesLocal] = useState<IDish[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const fetchFavorites = async () => {
        try {
            setIsLoading(true);
            const res = await FavoriteService.getMyFavorites();
            if (res.success) {
                setFavoritesLocal(res.data);
                // Sync global state
                const ids = res.data.map((dish: IDish) => dish.id);
                dispatch(setFavorites(ids));
            }
        } catch (error) {
            console.error('Failed to fetch favorites', error);
            toast.error('Failed to load your bookmarks');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <ChefLoader size={48} variant="flit" />
                <p className="text-neutral-500 animate-pulse font-medium">Gathering your favorites...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-sm">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-brand">
                        <div className="p-2 bg-brand/10 rounded-lg">
                            <Heart size={20} fill="currentColor" />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-widest">My Collection</span>
                    </div>
                    <h1 className="text-4xl font-bold font-heading text-neutral-900 tracking-tight">
                        Saved <span className="text-brand">Delights</span>
                    </h1>
                    <p className="text-neutral-500 max-w-md">
                        Your personal selection of the finest dishes from our community kitchens.
                    </p>
                </div>
            </div>

            {/* Content Grid */}
            {favorites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    <AnimatePresence mode="popLayout">
                        {favorites.map((dish) => (
                            <motion.div
                                key={dish.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <DishCard 
                                    dish={dish} 
                                    showKitchenName={true}
                                    showCheckout={true}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] p-16 text-center border border-neutral-100 shadow-sm flex flex-col items-center gap-6">
                    <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-300">
                        <ShoppingBag size={48} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-neutral-900">Your collection is empty</h2>
                        <p className="text-neutral-500 max-w-sm mx-auto">
                            Start adding some flavor to your bookmarks! Explore our kitchens to find your next favorite meal.
                        </p>
                    </div>
                    <Link to="/buyer/dashboard">
                        <Button className="bg-neutral-900 text-white px-8 h-14 rounded-2xl font-bold hover:bg-neutral-800 transition-all active:scale-95">
                            Browse Market
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Favorites;
