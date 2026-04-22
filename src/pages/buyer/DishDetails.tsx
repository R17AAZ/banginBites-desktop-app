import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { DishGallery } from '../../components/Dish/DishGallery';
import { DishInfo } from '../../components/Dish/DishInfo';
import { ChefSection } from '../../components/Dish/ChifSection';
import { ReviewsSection } from '../../components/Dish/ReviewSection';
import { DishService } from '../../services/dish.service';
import { IDish } from '../../types/api';
import toast from 'react-hot-toast';
import { ChefLoader } from '../../components/ui/LoadingSpinner';

const DishDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dish, setDish] = useState<IDish | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        if (!id) return;
        setIsLoading(true);
        const res = await DishService.getDish(id);
        if (res.success) {
          setDish(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch dish', error);
        toast.error('Dish not found');
        navigate('/buyer/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDish();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <ChefLoader size={48} variant="flit" />
        <p className="text-neutral-500 font-medium animate-pulse">Fetching dish details...</p>
      </div>
    );
  }

  if (!dish) return null;

  // Adapt backend dish to the expected structure of sub-components
  const displayDish = {
    ...dish,
    image: dish.images?.[0] || '/placeholder-dish.png',
    gallery: dish.images?.length ? dish.images : ['/placeholder-dish.png'],
    kitchen: {
      name: dish.seller?.name || 'Local Kitchen',
      rating: dish.seller?.metrics?.rating || 0,
      reviewsCount: dish.seller?.metrics?.totalReview || 0,
      image: dish.seller?.profile || '',
      bio: 'Chef dedicated to quality.',
      badges: ['Verified']
    },
    rating: dish.rating || 0,
    totalReviews: dish.totalReview || 0,
    tags: [dish.category?.name || 'Main'],
    features: [
      {
        label: 'Prep Time',
        value: dish.preparationTime ? `${dish.preparationTime} mins` : '15-20 min'
      },
      // { label: 'High Protein', value: '35g' },
      {
        label: 'Free Delivery',
        value: dish.isFreeDelivery ? 'Included' : 'Above £25'
      }
    ],
    reviews: dish.reviews?.map(rev => ({
      id: rev.id,
      user: rev.reviewer?.name || 'Anonymous',
      rating: rev.rating,
      comment: rev.review,
      date: new Date(rev.createdAt).toLocaleDateString(),
      avatar: rev.reviewer?.name ? rev.reviewer.name[0] : 'U',
      verified: rev.reviewer?.verified || false
    })) || []
  };

  return (
    <div className="space-y-12">
      {/* Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-neutral-500 hover:text-brand transition-colors font-medium group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Marketplace
      </button>

      {/* Main Content - 2 Equal Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DishGallery
          images={displayDish.gallery}
          selectedImage={selectedImage}
          onImageSelect={setSelectedImage}
        />
        <DishInfo dish={displayDish as any} />
      </div>

      {/* Chef & Reviews Section - 2 Equal Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-neutral-100">
        <ChefSection kitchen={displayDish.kitchen as any} />
        <ReviewsSection
          rating={displayDish.rating}
          totalReviews={displayDish.totalReviews}
          reviews={displayDish.reviews}
        />
      </div>
    </div>
  );
};

export default DishDetails;