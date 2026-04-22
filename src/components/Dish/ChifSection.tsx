import React from 'react';
import { ChefHat, Award } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Rating } from '../ui/Rating';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

interface ChefSectionProps {
    kitchen: {
        id?: string | number;
        name: string;
        rating: number;
        reviewsCount: number;
        image: string;
        bio: string;
        badges: string[];
        sellerId: string;
    };
}

export const ChefSection: React.FC<ChefSectionProps> = ({ kitchen }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
                <ChefHat size={22} className="text-brand" />
                Meet the Chef
            </h2>

            <Card className="bg-neutral-50 border-neutral-100 rounded-2xl">
                <CardContent className="p-5 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-brand/20 flex-shrink-0">
                            <img src={kitchen.image} className="w-full h-full object-cover" alt={kitchen.name} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-bold text-neutral-900 truncate">{kitchen.name}</h4>
                            <Rating
                                rating={kitchen.rating}
                                totalReviews={kitchen.reviewsCount}
                                showCount={true}
                                size="sm"
                            />
                        </div>
                    </div>

                    <p className="text-neutral-600 text-sm leading-relaxed italic">
                        "{kitchen.bio}"
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {kitchen.badges.map(badge => (
                            <span key={badge} className="flex items-center gap-1 text-[10px] font-semibold bg-brand/10 text-brand px-2 py-1 rounded-full">
                                <Award size={10} />
                                {badge}
                            </span>
                        ))}
                    </div>

                    <Link to={`/buyer/kitchen/${kitchen.id || '1'}`}>
                        <Button variant='secondary' className="w-full rounded-xl text-brand font-semibold  mt-4">
                            View Kitchen Profile {kitchen.sellerId}
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
};