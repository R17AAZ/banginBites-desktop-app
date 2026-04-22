import React from 'react';
import { Star, Clock, MapPin, ShieldCheck } from 'lucide-react';

interface KitchenHeaderProps {
    kitchen: {
        name: string;
        image: string;
        coverImage: string;
        rating: number;
        totalReviews: number;
        time: string;
        description: string;
        verified: boolean;
        categories?: Array<{ id: string; name: string }>;
    };
}

export const KitchenHeader: React.FC<KitchenHeaderProps> = ({ kitchen }) => {
    return (
        <div className="relative rounded-[2.5rem] overflow-hidden bg-white border border-neutral-100 shadow-sm">
            {/* Cover Image */}
            <div className="h-64 sm:h-80 w-full relative">
                <img
                    src={kitchen.coverImage}
                    alt={kitchen.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Profile Info Overlay */}
            <div className="px-8 pb-8 -mt-20 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex flex-col md:flex-row gap-6 md:items-end">
                        <div className="w-32 h-32 rounded-3xl border-4 border-white overflow-hidden bg-white shadow-xl">
                            <img
                                src={kitchen.image}
                                alt={kitchen.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="pb-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold font-heading text-white">{kitchen.name}</h1>
                                {kitchen.verified && (
                                    <div className="bg-brand/10 p-1 rounded-full text-brand" title="Verified Kitchen">
                                        <ShieldCheck size={20} />
                                    </div>
                                )}
                            </div>
                            <p className="text-white mt-1 max-w-xl line-clamp-2">
                                {kitchen.description}
                            </p>
                            {kitchen.categories && kitchen.categories.length > 0 && (
                                <div className="flex items-center gap-2 mt-3 flex-wrap">
                                    {kitchen.categories.map((cat) => (
                                        <span key={cat.id} className="text-[10px] font-bold uppercase tracking-wider text-brand bg-white px-2 py-0.5 rounded-md">
                                            {cat.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center gap-4 mt-4">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 rounded-xl text-yellow-700 text-xs font-bold ring-1 ring-yellow-100">
                                    <Star size={14} className="fill-yellow-500 text-yellow-500" />
                                    <span>{kitchen.rating} ({kitchen.totalReviews} Reviews)</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-50 rounded-xl text-neutral-700 text-xs font-bold ring-1 ring-neutral-100">
                                    <Clock size={14} />
                                    <span>{kitchen.time}</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-50 rounded-xl text-neutral-700 text-xs font-bold ring-1 ring-neutral-100">
                                    <MapPin size={14} />
                                    <span>2.4 km away</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
