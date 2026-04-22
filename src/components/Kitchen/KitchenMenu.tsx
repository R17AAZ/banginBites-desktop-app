import React from 'react';
import { Filter, Utensils } from 'lucide-react';
import { DishCard } from '../ui/DishCard';

interface KitchenMenuProps {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
    dishes: any[];
}

export const KitchenMenu: React.FC<KitchenMenuProps> = ({
    categories,
    activeCategory,
    onCategoryChange,
    dishes
}) => {
    return (
        <div className="lg:col-span-2 space-y-8">
            {/* Categories Filter */}
            <div className="flex items-center gap-4 pb-2 overflow-x-auto scrollbar-hide">
                <div className="p-2.5 bg-neutral-100 rounded-xl text-neutral-500">
                    <Filter size={18} />
                </div>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onCategoryChange(category)}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeCategory === category
                                ? 'bg-brand text-white shadow-md shadow-brand/20'
                                : 'bg-white text-neutral-500 border border-neutral-100 hover:border-brand/30'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4 gap-6">
                {dishes.map((dish) => (
                    <DishCard key={dish.id} dish={dish} />
                ))}
                {dishes.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-100">
                        <Utensils size={40} className="mx-auto text-neutral-300 mb-4" />
                        <h3 className="text-lg font-bold text-neutral-900">No dishes found</h3>
                        <p className="text-neutral-500">Try selecting a different category</p>
                    </div>
                )}
            </div>
        </div>
    );
};
