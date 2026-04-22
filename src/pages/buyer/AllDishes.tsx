import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DishCard } from '../../components/ui/DishCard';
import { DishService } from '../../services/dish.service';
import { IDish, ICategory } from '../../types/api';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { ChefLoader } from '../../components/ui/LoadingSpinner';
import { HeaderSection } from '../../components/buyer/HeaderSection';
import { CategoriesSection } from '../../components/buyer/CategoriesSection';
import { PriceSlider } from '../../components/ui/PriceSlider';
import { CategoryService } from '../../services/category.service';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/Button';

import { useDebounce } from '../../hooks/useDebounce';

const AllDishes: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [dishes, setDishes] = useState<IDish[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMoreLoading, setIsMoreLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [showPriceFilter, setShowPriceFilter] = useState(false);
    
    // Raw filter states from URL or inputs
    const searchTerm = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const minPrice = Number(searchParams.get('minPrice')) || 0;
    const maxPrice = Number(searchParams.get('maxPrice')) || 100;

    // Debounced filters
    const debouncedSearch = useDebounce(searchTerm, 500);
    const debouncedMinPrice = useDebounce(minPrice, 500);
    const debouncedMaxPrice = useDebounce(maxPrice, 500);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastDishElementRef = useCallback((node: HTMLDivElement | null) => {
        if (isLoading || isMoreLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, isMoreLoading, hasMore]);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await CategoryService.getAll();
            if (res.success) setCategories(res.data);
        };
        fetchCategories();
    }, []);

    const fetchDishes = async (currentPage: number, isNew: boolean = false) => {
        try {
            if (isNew) setIsLoading(true);
            else setIsMoreLoading(true);

            const response = await DishService.getDishes({
                searchTerm: debouncedSearch || undefined,
                categoryId: categoryId || undefined,
                minPrice: debouncedMinPrice || undefined,
                maxPrice: debouncedMaxPrice || undefined,
                page: currentPage,
                limit: 12
            });

            if (response.success) {
                if (isNew) {
                    setDishes(response.data);
                } else {
                    setDishes(prev => [...prev, ...response.data]);
                }
                setHasMore(response.data.length === 12);
            }
        } catch (error) {
            console.error('Failed to fetch dishes', error);
            toast.error('Failed to load dishes');
        } finally {
            setIsLoading(false);
            setIsMoreLoading(false);
        }
    };

    // Reset and fetch on filtered values change
    useEffect(() => {
        setPage(1);
        fetchDishes(1, true);
    }, [debouncedSearch, categoryId, debouncedMinPrice, debouncedMaxPrice]);

    // Fetch next page
    useEffect(() => {
        if (page > 1) {
            fetchDishes(page, false);
        }
    }, [page]);

    const updateFilter = (key: string, value: string | number | undefined) => {
        const newParams = new URLSearchParams(searchParams);
        if (value === undefined || value === '') {
            newParams.delete(key);
        } else {
            newParams.set(key, value.toString());
        }
        setSearchParams(newParams);
    };

    const clearPriceFilter = () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('minPrice');
        newParams.delete('maxPrice');
        setSearchParams(newParams);
        setShowPriceFilter(false);
    };

    return (
        <div className="space-y-12 pb-20">
            <HeaderSection 
                onSearch={(term) => updateFilter('search', term)} 
                initialValue={searchTerm}
                compact={true}
                title={<>Find the <span className="text-brand">Perfect Dish</span></>}
                subtitle="Browse through our wide selection of delicious home-cooked meals."
            />

            <div className="space-y-4">
                <CategoriesSection 
                    categories={categories}
                    selectedCategoryId={categoryId}
                    onCategoryClick={(id) => updateFilter('categoryId', id === categoryId ? undefined : id)}
                    title="Filter by Category"
                    subtitle="Find your favorite cuisines and dishes"
                />
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-4 z-30 pointer-events-none">
                <div className="flex items-center gap-3 w-full md:w-auto relative pointer-events-auto">
                    <div className="relative">
                        <button 
                            onClick={() => setShowPriceFilter(!showPriceFilter)}
                            className={cn(
                                "flex items-center gap-2 px-5 py-3 rounded-2xl font-black uppercase text-xs tracking-wider border shadow-sm transition-all",
                                (minPrice > 0 || maxPrice < 100) 
                                    ? "bg-brand text-white border-brand shadow-brand/20" 
                                    : "bg-white text-neutral-600 border-neutral-100 hover:border-neutral-200"
                            )}
                        >
                            <SlidersHorizontal size={16} />
                            <span>Price: £{minPrice} - £{maxPrice}</span>
                        </button>

                        {showPriceFilter && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowPriceFilter(false)} />
                                <div className="absolute top-full left-0 mt-3 w-80 bg-white border border-neutral-100 rounded-3xl shadow-2xl p-6 z-50 animate-in fade-in zoom-in duration-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-black font-heading text-neutral-900 uppercase text-xs tracking-widest">Price Range</h4>
                                        <button onClick={clearPriceFilter} className="text-neutral-400 hover:text-rose-500 transition-colors">
                                            <X size={18} />
                                        </button>
                                    </div>
                                    <PriceSlider 
                                        min={0} 
                                        max={200} 
                                        value={[minPrice, maxPrice]} 
                                        onChange={([min, max]) => {
                                            updateFilter('minPrice', min);
                                            updateFilter('maxPrice', max);
                                        }}
                                    />
                                    <Button 
                                        className="w-full mt-6 bg-neutral-900 h-10 text-xs font-black uppercase tracking-wider"
                                        onClick={() => setShowPriceFilter(false)}
                                    >
                                        Apply Filters
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>

                    {(searchTerm || categoryId || minPrice > 0 || maxPrice < 100) && (
                        <button 
                            onClick={() => setSearchParams(new URLSearchParams())}
                            className="text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-rose-500 flex items-center gap-1.5 transition-colors"
                        >
                            <X size={14} /> Reset Filters
                        </button>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-80 bg-neutral-100 animate-pulse rounded-[2.5rem]" />
                    ))}
                </div>
            ) : dishes.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {dishes.map((dish, index) => (
                            <div 
                                key={dish.id} 
                                ref={index === dishes.length - 1 ? lastDishElementRef : null}
                            >
                                <DishCard 
                                    dish={dish} 
                                    onAddToCart={() => toast.success(`Added ${dish.name} to cart`)}
                                />
                            </div>
                        ))}
                    </div>
                    {isMoreLoading && (
                        <div className="flex justify-center py-10">
                            <ChefLoader size={32} variant="sizzle" />
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-24 bg-neutral-50 rounded-[3rem] border border-dashed border-neutral-200">
                    <div className="w-20 h-20 bg-white rounded-3xl mx-auto flex items-center justify-center shadow-sm mb-6">
                        <Filter className="text-neutral-200" size={40} />
                    </div>
                    <h3 className="text-2xl font-black font-heading text-neutral-900 uppercase tracking-tight">No dishes found</h3>
                    <p className="text-neutral-500 mt-2 font-medium">Try adjusting your filters or search term</p>
                    <Button 
                        variant="ghost" 
                        className="mt-6 text-brand font-black uppercase text-xs tracking-widest"
                        onClick={() => setSearchParams(new URLSearchParams())}
                    >
                        Clear All Filters
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AllDishes;
