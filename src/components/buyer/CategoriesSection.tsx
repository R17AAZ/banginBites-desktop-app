import React, { useRef, useState } from 'react';
import { ICategory } from '../../types/api';
import { cn } from '../../lib/utils';

interface CategoriesSectionProps {
    categories: ICategory[];
    onCategoryClick?: (categoryId: string) => void;
    selectedCategoryId?: string;
    showTitle?: boolean;
    title?: string;
    subtitle?: string;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
    categories,
    onCategoryClick,
    selectedCategoryId,
    showTitle = true,
    title = "Explore Cuisines",
    subtitle = "Discover delicious meals from top categories"
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
        setScrollLeft(scrollRef.current?.scrollLeft || 0);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
        const walk = (x - startX) * 2; // Scroll speed
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    return (
        <section className="space-y-6">
            {showTitle && (
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold font-heading text-neutral-900">{title}</h2>
                        <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>
                    </div>
                </div>
            )}

            <div 
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className={cn(
                    "flex gap-5 overflow-x-auto scrollbar-hide py-3 px-1 cursor-grab active:cursor-grabbing select-none",
                    isDragging && "pointer-events-none"
                )}
            >
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => {
                            if (!isDragging) onCategoryClick?.(cat.id);
                        }}
                        className={cn(
                            "group relative flex flex-col items-center gap-3 px-4 py-2 rounded-2xl min-w-[100px] transition-all duration-300 pointer-events-auto",
                            selectedCategoryId === cat.id && "bg-brand/5"
                        )}
                    >
                        <div className={cn(
                            "relative w-20 h-20 rounded-full overflow-hidden transition-all duration-300 group-hover:scale-105",
                            selectedCategoryId === cat.id ? "ring-4 ring-brand ring-offset-2" : "ring-1 ring-neutral-100"
                        )}>
                            <img
                                src={cat.image || '/placeholder-category.png'}
                                alt={cat.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className={cn(
                                "absolute inset-0 transition-colors duration-300",
                                selectedCategoryId === cat.id ? "bg-brand/10" : "bg-black/0 group-hover:bg-black/10"
                            )} />
                        </div>

                        <div className="text-center">
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-wider transition-colors",
                                selectedCategoryId === cat.id ? "text-brand" : "text-neutral-500 group-hover:text-brand"
                            )}>
                                {cat.name}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
};