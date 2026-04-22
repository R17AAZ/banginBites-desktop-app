import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface HeaderSectionProps {
    onSearch?: (term: string) => void;
    initialValue?: string;
    compact?: boolean;
    title?: React.ReactNode;
    subtitle?: string;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
    onSearch,
    initialValue = '',
    compact = false,
    title,
    subtitle
}) => {
    const [searchTerm, setSearchTerm] = useState(initialValue);
    const navigate = useNavigate();

    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchTerm);
        } else {
            navigate(`/buyer/dishes?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <div className={cn(
            "relative overflow-hidden rounded-[2.5rem] bg-white border border-neutral-100 shadow-sm transition-all",
            compact ? "px-6 py-8" : "px-8 py-16"
        )}>
            <div className="relative z-10 max-w-4xl">
                <h1 className={cn(
                    "font-black font-heading text-neutral-900 leading-[1.1] tracking-tight transition-all",
                    compact ? "text-2xl md:text-4xl mb-2" : "text-4xl md:text-7xl mb-4"
                )}>
                    {title || (
                        <>Authentic <br /><span className="text-brand">Home-Cooked</span> Food</>
                    )}
                </h1>
                <p className={cn(
                    "text-neutral-500 font-sans leading-relaxed transition-all",
                    compact ? "text-sm mb-6" : "text-lg font-medium mb-10 max-w-md"
                )}>
                    {subtitle || "Discover fresh, authentic homemade dishes prepared by passionate local chefs in your London community."}
                </p>

                <div className={cn(
                    "flex flex-col sm:flex-row gap-3 bg-neutral-50 p-2 rounded-3xl border border-neutral-100 transition-all focus-within:border-brand/30 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-brand/5",
                    compact ? "max-w-xl" : "max-w-2xl"
                )}>
                    <div className="flex-1 relative group">
                        <Input
                            placeholder="Search for delicious meals..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="bg-transparent text-neutral-900 pr-4 pl-10 h-12 rounded-2xl border-none focus:ring-0 focus:bg-transparent transition-all text-base font-medium"
                            leftIcon={<Search size={22} className="text-neutral-400 group-focus-within:text-brand transition-colors" />}
                        />
                    </div>
                    <Button
                        onClick={handleSearch}
                        className={cn(
                            "rounded-2xl font-black uppercase tracking-wider bg-brand hover:scale-[1.02] active:scale-[0.98] transition-all",
                            compact ? "h-12 px-6 text-sm" : "h-14 px-10 text-lg"
                        )}
                    >
                        Search
                    </Button>
                </div>
            </div>

            {/* Decorative elements */}
            {!compact && (
                <>
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-brand/5 -skew-x-12 transform translate-x-32 hidden md:block"></div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand/5 rounded-full blur-3xl"></div>
                </>
            )}
        </div>
    );
};