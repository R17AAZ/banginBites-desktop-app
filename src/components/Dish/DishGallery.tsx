import React from 'react';

interface DishGalleryProps {
    images: string[];
    selectedImage: number;
    onImageSelect: (index: number) => void;
}

export const DishGallery: React.FC<DishGalleryProps> = ({
    images,
    selectedImage,
    onImageSelect
}) => {
    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 relative group">
                <img
                    src={images[selectedImage]}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt="Dish"
                />
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => onImageSelect(idx)}
                        className={`relative w-20 h-20 rounded-xl overflow-hidden cursor-pointer transition-all flex-shrink-0 ${selectedImage === idx
                                ? 'ring-2 ring-brand ring-offset-2'
                                : 'opacity-70 hover:opacity-100'
                            }`}
                    >
                        <img
                            src={img}
                            className="w-full h-full object-cover"
                            alt={`Thumbnail ${idx + 1}`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};