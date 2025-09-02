import { useState } from 'react';
import { Check, X } from 'lucide-react';

interface ImageSelectorProps {
    images: string[];
    onSelectionComplete: (selectedImages: string[]) => void;
}

export default function ImageSelector({ images, onSelectionComplete }: ImageSelectorProps) {
    const [selectedImages, setSelectedImages] = useState<string[]>(images);

    const toggleImage = (image: string) => {
        setSelectedImages(prev => 
            prev.includes(image) 
                ? prev.filter(img => img !== image)
                : [...prev, image]
        );
    };

    const selectAll = () => {
        setSelectedImages(images);
    };

    const deselectAll = () => {
        setSelectedImages([]);
    };

    const handleContinue = () => {
        if (selectedImages.length > 0) {
            onSelectionComplete(selectedImages);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Select Images to Analyze</h2>
                <p className="text-gray-600">Choose which images you want to use as reference for generating new product shots</p>
            </div>

            <div className="mb-4 flex items-center justify-between">
                <div className="flex gap-2">
                    <button
                        onClick={selectAll}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Select All
                    </button>
                    <button
                        onClick={deselectAll}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Deselect All
                    </button>
                </div>
                <span className="text-sm text-gray-600">
                    {selectedImages.length} of {images.length} selected
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {images.map((image, index) => {
                    const isSelected = selectedImages.includes(image);
                    return (
                        <div
                            key={index}
                            onClick={() => toggleImage(image)}
                            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                isSelected 
                                    ? 'border-[#FF4D00] shadow-lg' 
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <div className="aspect-square bg-gray-100">
                                <img
                                    src={image}
                                    alt={`Product image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            {/* Selection Overlay */}
                            <div className={`absolute inset-0 transition-opacity ${
                                isSelected 
                                    ? 'bg-[#FF4D00] bg-opacity-20' 
                                    : 'bg-black bg-opacity-0 hover:bg-opacity-10'
                            }`}>
                                {isSelected && (
                                    <div className="absolute top-2 right-2 bg-[#FF4D00] text-white rounded-full p-1">
                                        <Check className="w-4 h-4" />
                                    </div>
                                )}
                            </div>

                            <div className="p-2 bg-white">
                                <p className="text-xs text-gray-600">Image {index + 1}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleContinue}
                    disabled={selectedImages.length === 0}
                    className="px-6 py-2 bg-[#FF4D00] text-white font-medium rounded-lg hover:bg-[#E64400] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue with {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''}
                </button>
            </div>
        </div>
    );
}