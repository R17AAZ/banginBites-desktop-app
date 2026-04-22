import React, { useEffect, useState } from 'react';
import { HeaderSection } from '../../components/buyer/HeaderSection';
import { CategoriesSection } from '../../components/buyer/CategoriesSection';
import { KitchensSection } from '../../components/buyer/KitchenSection';

import { DishService } from '../../services/dish.service';
import { PublicService } from '../../services/public.service';
import { ICategory, IDish, User } from '../../types/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { CategoryService } from '../../services/category.service';

import { ChefLoader } from '../../components/ui/LoadingSpinner';
import { PopularDishesSection } from '../../components/buyer/PopularDishes';
import { MissionSection } from '../../components/buyer/MissionSection';

const BuyerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [dishes, setDishes] = useState<IDish[]>([]);
  const [kitchens, setKitchens] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [categoriesRes, dishesRes, kitchensRes] = await Promise.all([
          CategoryService.getAll(),
          DishService.getDishes({ limit: 4 }),
          PublicService.getFeaturedKitchens()
        ]);

        if (categoriesRes.success) setCategories(categoriesRes.data);
        if (dishesRes.success) setDishes(dishesRes.data);
        if (kitchensRes.success) setKitchens(kitchensRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-vh-100 p-20">
        <div className="flex flex-col items-center gap-4">
          <ChefLoader size={48} variant="flit" />
          <p className="text-neutral-500 animate-pulse font-medium">Prepping your feast...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <HeaderSection />
      <CategoriesSection
        categories={categories}
        onCategoryClick={(id) => navigate(`/buyer/dishes?categoryId=${id}`)}
      />
      <PopularDishesSection popularDishes={dishes} />
      <MissionSection />
      <KitchensSection kitchens={kitchens} />
      {/* <JoinCommunitySection /> */}
    </div>
  );
};

export default BuyerDashboard;