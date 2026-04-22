import React from 'react';
import { IDish } from '../../types/api';
import { DishCard } from '../ui/DishCard';
import toast from 'react-hot-toast';

interface PopularDishesSectionProps {
    popularDishes: IDish[];
}

export const PopularDishesSection: React.FC<PopularDishesSectionProps> = ({
    popularDishes
}) => {
    if (!popularDishes || popularDishes.length === 0) return null;

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold font-heading text-neutral-900">Trending Now</h2>
                    <p className="text-sm text-neutral-500 mt-1">Our community's most loved meals</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {popularDishes.slice(0, 4).map((dish) => (
                    <DishCard 
                        key={dish.id} 
                        dish={dish} 
                        onAddToCart={() => toast.success(`Added ${dish.name} to cart`)}
                    />
                ))}
            </div>
        </section>
    );
};
