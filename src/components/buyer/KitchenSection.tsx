import { KitchenCard } from '../ui/KitchenCard';
import { Button } from '../ui/Button';
import { User } from '../../types/api';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface KitchensSectionProps {
    kitchens: User[];
}

export const KitchensSection: React.FC<KitchensSectionProps> = ({ kitchens }) => {
    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold font-heading text-neutral-900">Featured Kitchens</h2>
                    <p className="text-sm text-neutral-500 mt-1">Discover the best local kitchens near you</p>
                </div>
                <Link to="/buyer/kitchens">
                    <Button variant="ghost" className="font-bold text-brand flex items-center gap-1 group">
                        View All <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {kitchens.map((kitchen) => (
                    <KitchenCard key={kitchen.id} kitchen={kitchen} />
                ))}
            </div>
        </section>
    );
};