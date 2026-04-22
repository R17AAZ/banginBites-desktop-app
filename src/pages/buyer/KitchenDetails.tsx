import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Heart } from 'lucide-react';
import { ReviewsSection } from '../../components/Dish/ReviewSection';
import { KitchenHeader } from '../../components/Kitchen/KitchenHeader';
import { KitchenMenu } from '../../components/Kitchen/KitchenMenu';
import { KitchenAbout } from '../../components/Kitchen/KitchenAbout';
import { UserService } from '../../services/user.service';
import { ReviewService } from '../../services/review.service';
import { User, IReview } from '../../types/api';
import toast from 'react-hot-toast';
import { ChefLoader } from '../../components/ui/LoadingSpinner';

const KitchenDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('All');
    const [seller, setSeller] = useState<User | null>(null);
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSeller = async () => {
            try {
                if (!id) return;
                setIsLoading(true);
                const [sellerRes, reviewsRes] = await Promise.all([
                    UserService.getSellerProfile(id),
                    ReviewService.getReviewsByTarget('seller', id)
                ]);

                if (sellerRes.success) {
                    setSeller(sellerRes.data);
                }
                if (reviewsRes.success) {
                    setReviews(reviewsRes.data);
                }
            } catch (error) {
                console.error('Failed to fetch kitchen details', error);
                toast.error('Kitchen not found');
                navigate('/buyer/dashboard');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSeller();
    }, [id, navigate]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <ChefLoader size={48} variant="sizzle" />
                <p className="text-neutral-500 font-medium animate-pulse">Entering the kitchen...</p>
            </div>
        );
    }

    if (!seller) return null;

    // Adapt API data for display
    const kitchenDetails = {
        name: seller.name || 'Local Kitchen',
        image: seller.profile || '/placeholder-chef.png',
        coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80",
        rating: seller.metrics?.rating || 0,
        totalReviews: seller.metrics?.totalReview || 0,
        time: "20-30 mins",
        description: "Passionate about creating authentic culinary experiences. We use only the freshest, locally-sourced ingredients to bring you the best flavors of our heritage.",
        joinedDate: "Mar 2023",
        verified: seller.verified || false,
        badges: ["Top Rated", "Hyper-Local", "Fast Delivery"],
        bio: "Passionate about creating authentic culinary experiences. We use only the freshest, locally-sourced ingredients to bring you the best flavors of our heritage.",
        categories: seller.categories,
        reviews: reviews.map(rev => ({
            id: rev.id,
            user: rev.reviewer?.name || 'Anonymous',
            rating: rev.rating,
            comment: rev.review,
            date: new Date(rev.createdAt).toLocaleDateString(),
            avatar: rev.reviewer?.name ? rev.reviewer.name[0] : 'U',
            verified: rev.reviewer?.verified || false
        }))
    };

    const kitchenDishes = (seller as any).dishes || [];

    const categories = Array.from(new Set(kitchenDishes.map((d: any) => d.category?.name || 'Main'))).filter(Boolean) as string[];
    const kitchenCategories = ['All', ...categories];

    const filteredDishes = activeCategory === 'All'
        ? kitchenDishes
        : kitchenDishes.filter((dish: any) => (dish.category?.name || 'Main') === activeCategory);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Navigation & Actions */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-neutral-500 hover:text-brand transition-colors font-medium group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Marketplace
                </button>
                <div className="flex items-center gap-3">
                    <button className="p-2.5 rounded-xl border border-neutral-100 text-neutral-600 hover:bg-neutral-50 transition-colors">
                        <Share2 size={18} />
                    </button>
                    <button className="p-2.5 rounded-xl border border-neutral-100 text-neutral-600 hover:bg-neutral-50 transition-colors">
                        <Heart size={18} />
                    </button>
                </div>
            </div>

            {/* Kitchen Header Profile */}
            <KitchenHeader kitchen={kitchenDetails} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-4">
                {/* Left Column - Menu & Filters */}
                <KitchenMenu
                    categories={kitchenCategories}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                    dishes={filteredDishes}
                />

                {/* Right Column - Kitchen Info & Reviews */}
                <div className="space-y-10">
                    <KitchenAbout kitchen={kitchenDetails} />

                    <div className="bg-white rounded-[2rem] border border-neutral-100 p-8">
                        <ReviewsSection
                            rating={kitchenDetails.rating}
                            totalReviews={kitchenDetails.totalReviews}
                            reviews={kitchenDetails.reviews}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KitchenDetails;
