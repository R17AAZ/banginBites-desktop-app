import React from 'react';

interface KitchenAboutProps {
    kitchen: {
        bio: string;
        joinedDate: string;
        badges: string[];
    };
}

export const KitchenAbout: React.FC<KitchenAboutProps> = ({ kitchen }) => {
    return (
        <div className="bg-white rounded-[2rem] border border-neutral-100 p-8 space-y-6">
            <h3 className="text-xl font-bold font-heading text-neutral-900">About the Kitchen</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
                {kitchen.bio}
            </p>

            <div className="pt-4 border-t border-neutral-50 space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-500 font-medium">Joined</span>
                    <span className="text-neutral-900 font-bold">{kitchen.joinedDate}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-500 font-medium">Response Time</span>
                    <span className="text-neutral-900 font-bold">~15 mins</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
                {kitchen.badges.map(badge => (
                    <span key={badge} className="px-3 py-1 bg-brand/5 text-brand text-[10px] font-bold rounded-lg uppercase tracking-wide">
                        {badge}
                    </span>
                ))}
            </div>
        </div>
    );
};
