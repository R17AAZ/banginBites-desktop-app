import { Clock, Flame, Truck, ChefHat, ShieldCheck, Share2, Heart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Rating } from '../ui/Rating';
import { Button } from '../ui/Button';
import { addItem } from '../../store/slices/cartSlice';
import { toggleFavoriteLocal } from '../../store/slices/favoriteSlice';
import { FavoriteService } from '../../services/favorite.service';
import toast from 'react-hot-toast';

interface DishInfoProps {
    dish: {
        image: string;
        id: string;
        name: string;
        price: number;
        originalPrice?: number;
        description: string;
        kitchen: { name: string };
        rating: number;
        totalReviews: number;
        tags: string[];
        features: Array<{ label: string; value: string }>;
        ingredients?: string[];
        isFavorite?: boolean;
        sellerId: string;
    };
}

export const DishInfo: React.FC<DishInfoProps> = ({ dish }) => {
    const dispatch = useAppDispatch();
    const favoriteIds = useAppSelector(state => state.favorite.ids);
    const isFavorite = favoriteIds.includes(dish.id);

    const getFeatureIcon = (label: string) => {
        switch (label) {
            case 'High Protein': return <Flame size={16} />;
            case 'Prep Time': return <Clock size={16} />;
            case 'Free Delivery': return <Truck size={16} />;
            default: return null;
        }
    };

    const toggleFavorite = async () => {
        // Optimistic update
        dispatch(toggleFavoriteLocal(dish.id));

        try {
            const res = await FavoriteService.toggleFavorite(dish.id);
            if (res.success) {
                toast.success(res.message);
            }
        } catch (error) {
            // Revert on failure
            dispatch(toggleFavoriteLocal(dish.id));
            toast.error('Failed to update favorite');
        }
    };

    return (
        <div className="space-y-6 relative pb-20 lg:pb-0">
            {/* Header */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-brand bg-brand/10 px-3 py-1.5 rounded-full">
                            {dish.kitchen.name}
                        </span>
                        {dish.tags.map(tag => (
                            <span key={tag} className="text-xs font-bold text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={toggleFavorite}
                            className={`p-2.5 rounded-xl transition-all active:scale-95 ${isFavorite ? 'bg-brand text-white shadow-brand/20 shadow-lg' : 'bg-neutral-100 text-neutral-400 hover:text-brand'
                                }`}
                        >
                            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                        </button>
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold font-heading text-neutral-900">
                    {dish.name}
                </h1>

                <Rating
                    rating={dish.rating}
                    totalReviews={dish.totalReviews}
                    showCount={true}
                    size="md"
                    variant="brand"
                />

                <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-brand">£{dish.price}</span>
                    {dish.originalPrice && (
                        <span className="text-base text-neutral-400 line-through">£{dish.originalPrice}</span>
                    )}
                </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-3 gap-3">
                {dish.features.map((feature, idx) => (
                    <div key={idx} className="bg-neutral-50 rounded-xl p-3 text-center border border-neutral-100">
                        <div className="text-brand mb-1 flex justify-center">
                            {getFeatureIcon(feature.label)}
                        </div>
                        <div className="text-[10px] font-semibold text-neutral-500 uppercase">{feature.label}</div>
                        <div className="text-xs font-bold text-neutral-700">{feature.value}</div>
                    </div>
                ))}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <h3 className="font-bold text-neutral-900 text-xs tracking-widest flex items-center gap-2 uppercase">
                    <ChefHat size={14} /> About this dish
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                    {dish.description}
                </p>
            </div>

            {/* Ingredients Section */}
            {dish.ingredients && dish.ingredients.length > 0 && (
                <div className="space-y-3">
                    <h3 className="font-bold text-neutral-900 text-xs tracking-widest flex items-center gap-2 uppercase">
                        <Flame size={14} /> Ingredients
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {dish.ingredients.map((item, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-600 font-medium"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="pt-2 space-y-4 lg:absolute lg:bottom-0 lg:left-0 lg:right-0">
                <div className="flex gap-3">
                    <Button
                        size="lg"
                        className="flex-1 h-12 rounded-xl text-sm font-bold bg-brand hover:bg-brand/90 "
                        onClick={() => dispatch(addItem({
                            id: dish.id,
                            name: dish.name,
                            price: dish.price,
                            image: dish.image,
                            kitchenName: dish.kitchen.name
                        }))}
                    >
                        Add to Cart • £{dish.price}
                    </Button>
                    {/* <Button
                        size="lg"
                        variant="secondary"
                        className="h-12 w-12 rounded-xl bg-neutral-100 hover:bg-neutral-200"
                    >
                        <Share2 size={16} />
                    </Button> */}
                </div>

                <p className="text-center text-xs text-neutral-500 flex items-center justify-center gap-1.5">
                    <ShieldCheck size={12} className="text-green-500" />
                    Secure Checkout & Freshness Guaranteed
                </p>
            </div>
        </div>
    );
};

