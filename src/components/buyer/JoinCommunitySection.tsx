import React from 'react';
import { Button } from '../ui/Button';
import { ChefHat, Rocket, ArrowRight } from 'lucide-react';

export const JoinCommunitySection: React.FC = () => {
    return (
        <section className="bg-brand rounded-[2.5rem] p-8 md:p-16 text-white overflow-hidden relative group">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="max-w-xl space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-bold backdrop-blur-md">
                        <Rocket size={16} /> Join the movement
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black font-heading leading-tight">
                        Turn your kitchen into a <span className="text-brand-100">thriving business.</span>
                    </h2>
                    <p className="text-brand-50 text-lg leading-relaxed">
                        Are you a passionate home cook in London? Share your culinary skills, empower your neighborhood, and earn income by selling your authentic meals through Bangin’ Bites.
                    </p>
                    <div className="pt-4">
                        <Button className="bg-white text-brand hover:bg-brand-50 h-14 px-10 text-lg font-black rounded-2xl group flex items-center gap-2">
                            Become a Seller <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>

                <div className="relative hidden lg:block">
                    <div className="w-64 h-64 bg-white/10 rounded-[3rem] rotate-12 flex items-center justify-center backdrop-blur-xl border border-white/20">
                        <ChefHat size={120} className="text-white drop-shadow-2xl" />
                    </div>
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-brand-200 rounded-full blur-2xl opacity-50"></div>
                </div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-32"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
        </section>
    );
};
