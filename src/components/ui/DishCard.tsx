import { Star, Clock, Plus, Truck, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Rating } from './Rating';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addItem, toggleCart } from '../../store/slices/cartSlice';
import { toggleFavoriteLocal } from '../../store/slices/favoriteSlice';
import { FavoriteService } from '../../services/favorite.service';
import { IDish } from '../../types/api';
import toast from 'react-hot-toast';

interface DishCardProps {
    dish: IDish;
    showKitchenName?: boolean;
    showCheckout?: boolean;
    onAddToCart?: () => void;
}

export const DishCard: React.FC<DishCardProps> = ({
    dish,
    showKitchenName = true,
    showCheckout = false,
    onAddToCart
}) => {
    const favoriteIds = useAppSelector(state => state.favorite.ids);
    const isFavorite = favoriteIds.includes(dish.id);
    const deliveryTime = dish.preparationTime ? `${dish.preparationTime} mins` : "25-35 min";
    const dispatch = useAppDispatch();

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Optimistic update
        dispatch(toggleFavoriteLocal(dish.id));

        try {
            const res = await FavoriteService.toggleFavorite(dish.id);
            if (res.success) {
                toast.success(res.message);
                // Ensure state matches server (though usually toggle handles it)
            }
        } catch (error) {
            // Revert on failure
            dispatch(toggleFavoriteLocal(dish.id));
            toast.error('Failed to update favorite');
        }
    };

    return (
        <div className="group relative flex flex-col bg-neutral-100 rounded-3xl border border-neutral-100 transition-all duration-300 overflow-hidden hover:border-transparent hover:shadow-lg">
            <Link to={`/buyer/dish/${dish.id}`} className="block h-48 relative overflow-hidden">
                <img
                    src={(dish.images && dish.images[0]) || '/placeholder-dish.png'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={dish.name}
                />
                <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm">
                        <Rating rating={dish.rating || 0} size="sm" />
                    </div>
                    {dish.isFreeDelivery && (
                        <div className="bg-green-500/90 backdrop-blur-sm px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm">
                            <Truck size={12} className="text-white" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-tight">Free</span>
                        </div>
                    )}
                </div>

                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={toggleFavorite}
                        className={`p-2.5 rounded-xl backdrop-blur-md shadow-lg transition-all active:scale-95 ${
                            isFavorite ? 'bg-brand text-white' : 'bg-white/90 text-neutral-600 hover:text-brand'
                        }`}
                    >
                        <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>
                </div>

                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl">
                    <span className="text-sm font-bold text-brand">£{dish.price}</span>
                </div>
            </Link>

            <div className="p-6 flex flex-col flex-1">
                {showKitchenName && (
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand bg-brand/5 px-2 py-0.5 rounded-md">
                            {dish.seller?.name || 'Local Kitchen'}
                        </span>
                    </div>
                )}

                <Link
                    to={`/buyer/dish/${dish.id}`}
                    className="text-xl font-bold font-heading text-neutral-900 mb-4 line-clamp-1 group-hover:text-brand transition-colors"
                >
                    {dish.name}
                </Link>

                <div className="mt-auto flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-neutral-700 text-[10px] font-bold uppercase">
                        <Clock size={12} />
                        <span>{deliveryTime}</span>
                    </div>

                    {showCheckout ? (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                dispatch(addItem({
                                    id: dish.id,
                                    name: dish.name,
                                    price: dish.price,
                                    image: (dish.images && dish.images[0]) || '/placeholder-dish.png',
                                    kitchenName: dish.seller?.name
                                }));
                                dispatch(toggleCart());
                            }}
                            className="flex-1 bg-brand text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-brand/20"
                        >
                            Checkout
                            <ArrowRight size={14} />
                        </button>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                dispatch(addItem({
                                    id: dish.id,
                                    name: dish.name,
                                    price: dish.price,
                                    image: (dish.images && dish.images[0]) || '/placeholder-dish.png',
                                    kitchenName: dish.seller?.name
                                }));
                                if (onAddToCart) onAddToCart();
                            }}
                            className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center active:scale-90"
                        >
                            <Plus size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};