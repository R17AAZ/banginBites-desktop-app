import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { KitchenCard } from '../../components/ui/KitchenCard';
import { PublicService } from '../../services/public.service';
import { User, ICategory } from '../../types/api';
import { Filter, X } from 'lucide-react';
import { ChefLoader } from '../../components/ui/LoadingSpinner';
import { HeaderSection } from '../../components/buyer/HeaderSection';
import { CategoriesSection } from '../../components/buyer/CategoriesSection';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';

import { useDebounce } from '../../hooks/useDebounce';

const AllKitchens: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [kitchens, setKitchens] = useState<User[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMoreLoading, setIsMoreLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    
    // Raw filter states from URL
    const searchTerm = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';

    // Debounced search
    const debouncedSearch = useDebounce(searchTerm, 500);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastKitchenElementRef = useCallback((node: HTMLDivElement | null) => {
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
            const res = await PublicService.getCategories();
            if (res.success) setCategories(res.data);
        };
        fetchCategories();
    }, []);

    const fetchKitchens = async (currentPage: number, isNew: boolean = false) => {
        try {
            if (isNew) setIsLoading(true);
            else setIsMoreLoading(true);

            const response = await PublicService.getAllKitchens({
                searchTerm: debouncedSearch || undefined,
                categoryId: categoryId || undefined,
                page: currentPage,
                limit: 12
            });

            if (response.success) {
                if (isNew) {
                    setKitchens(response.data);
                } else {
                    setKitchens(prev => [...prev, ...response.data]);
                }
                setHasMore(response.data.length === 12);
            }
        } catch (error) {
            console.error('Failed to fetch kitchens', error);
            toast.error('Failed to load kitchens');
        } finally {
            setIsLoading(false);
            setIsMoreLoading(false);
        }
    };

    // Reset and fetch on debounced search change
    useEffect(() => {
        setPage(1);
        fetchKitchens(1, true);
    }, [debouncedSearch, categoryId]);

    // Fetch next page
    useEffect(() => {
        if (page > 1) {
            fetchKitchens(page, false);
        }
    }, [page]);

    const updateFilter = (key: string, value: string | undefined) => {
        const newParams = new URLSearchParams(searchParams);
        if (value === undefined || value === '') {
            newParams.delete(key);
        } else {
            newParams.set(key, value.toString());
        }
        setSearchParams(newParams);
    };

    return (
        <div className="space-y-12 pb-20">
            <HeaderSection 
                onSearch={(term) => updateFilter('search', term)} 
                initialValue={searchTerm}
                compact={true}
                title={<>Local <span className="text-brand">Home Kitchens</span></>}
                subtitle="Discover talented home chefs and authentic kitchens in your neighborhood."
            />

            <div className="space-y-4">
                <CategoriesSection 
                    categories={categories}
                    selectedCategoryId={categoryId}
                    onCategoryClick={(id) => updateFilter('categoryId', id === categoryId ? undefined : id)}
                    title="Filter by Kitchen Type"
                    subtitle="Discover talented home chefs in your neighborhood"
                />
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {(searchTerm || categoryId) && (
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
            ) : kitchens.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {kitchens.map((kitchen, index) => (
                            <div 
                                key={kitchen.id} 
                                ref={index === kitchens.length - 1 ? lastKitchenElementRef : null}
                            >
                                <KitchenCard kitchen={kitchen} />
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
                    <h3 className="text-2xl font-black font-heading text-neutral-900 uppercase tracking-tight">No kitchens found</h3>
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

export default AllKitchens;
