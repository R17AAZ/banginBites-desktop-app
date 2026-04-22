import React from 'react';
import { MapPin, Star, Clock, Utensils, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Rating } from './Rating';
import { User } from '../../types/api';

interface KitchenCardProps {
  kitchen: User;
}

export const KitchenCard: React.FC<KitchenCardProps> = ({ kitchen }) => {
  return (
    <Link
      to={`/buyer/kitchen/${kitchen.id}`}
      className="group relative flex flex-col bg-neutral-100 rounded-3xl border border-neutral-100 transition-all duration-300 overflow-hidden hover:border-transparent hover:shadow-lg"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={kitchen.profile || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500'}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          alt={kitchen.name}
        />

        {/* Rating Badge */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm">
          <Rating rating={kitchen.metrics?.rating || 0} size="sm" />
        </div>

        {/* Open Status Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-green-500/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl shadow-sm">
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Open</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        {/* Categories */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {kitchen.categories && kitchen.categories.length > 0 ? (
            kitchen.categories.slice(0, 3).map((cat) => (
              <span key={cat.id} className="text-[10px] font-bold uppercase tracking-wider text-brand bg-brand/10 px-2 py-0.5 rounded-md">
                {cat.name}
              </span>
            ))
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand bg-brand/10 px-2 py-0.5 rounded-md">
              Local Kitchen
            </span>
          )}
          {kitchen.categories && kitchen.categories.length > 3 && (
            <span className="text-[10px] font-medium text-neutral-500">
              +{kitchen.categories.length - 3} more
            </span>
          )}
        </div>

        {/* Kitchen Name */}
        <h3 className="text-xl font-bold font-heading text-neutral-900 mb-2 group-hover:text-brand transition-colors line-clamp-1">
          {kitchen.name}
        </h3>

        {/* Location */}
        {kitchen.address && (
          <div className="flex items-center gap-1.5 mb-3 text-neutral-500 text-[10px] font-medium">
            <MapPin size={12} />
            <span>{kitchen.address.city}, {kitchen.address.country}</span>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-neutral-300/50">
          <div className="flex items-center gap-3 text-neutral-700 text-[10px] font-bold uppercase">
            <div className="flex items-center gap-1.5">
              <Clock size={12} />
              <span>20-30 min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Utensils size={12} />
              <span>£10 Min</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-brand text-[10px] font-bold uppercase group-hover:gap-2 transition-all">
            <span>View Menu</span>
            <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
};
