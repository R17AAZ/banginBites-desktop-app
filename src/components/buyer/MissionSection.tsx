import React from 'react';
import { ChefHat, Heart, ShieldCheck, Users } from 'lucide-react';

export const MissionSection: React.FC = () => {
    const features = [
        {
            icon: <ChefHat className="text-brand" size={24} />,
            title: "Authentic & Homemade",
            description: "Skip the processed takeaways. Enjoy fresh, homemade meals prepared by passionate local chefs in your community."
        },
        {
            icon: <Heart className="text-red-500" size={24} />,
            title: "Support Local Talent",
            description: "Every order empowers home-grown food entrepreneurs to share their culinary heritage and thrive doing what they love."
        },
        {
            icon: <Users className="text-blue-500" size={24} />,
            title: "Community Driven",
            description: "Discover diverse cultural cuisines and connect with your neighborhood through the universal language of food."
        },
        {
            icon: <ShieldCheck className="text-green-500" size={24} />,
            title: "Order with Confidence",
            description: "Verified kitchens, transparent reviews, and community ratings ensure you always get the best quality handcrafted food."
        }
    ];

    return (
        <section className="bg-brand-50 rounded-3xl p-8 md:p-12 border border-brand-100">
            <div className="max-w-3xl mb-12">
                <h2 className="text-3xl font-bold font-heading text-neutral-900 mb-4">
                    The Bangin' Bites Experience
                </h2>
                <p className="text-neutral-500 text-lg leading-relaxed">
                    We're more than just a marketplace. We're a community of food lovers connecting local kitchens with hungry neighbors who crave authentic, fresh, and soulful meals.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, idx) => (
                    <div key={idx} className="space-y-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-neutral-100">
                            {feature.icon}
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900">
                            {feature.title}
                        </h3>
                        <p className="text-sm text-neutral-500 leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};
