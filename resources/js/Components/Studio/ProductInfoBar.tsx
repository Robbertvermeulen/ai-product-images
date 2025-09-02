import { useState } from 'react';
import { Link2, FileText, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

interface ProductInfoBarProps {
    title?: string;
    description?: string;
    url?: string;
    images: string[];
    imageDescriptions?: string[];
}

export default function ProductInfoBar({ 
    title, 
    description, 
    url, 
    images,
    imageDescriptions 
}: ProductInfoBarProps) {
    const [expandedDescription, setExpandedDescription] = useState(false);
    const maxDescriptionLength = 200;
    const shouldTruncate = description && description.length > maxDescriptionLength;
    const displayDescription = shouldTruncate && !expandedDescription 
        ? description.substring(0, maxDescriptionLength) + '...'
        : description;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5">
                <div className="flex items-start gap-8">
                    {/* Left Section: Title, URL, Images */}
                    <div>
                        {/* Product Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {title || 'Untitled Product'}
                        </h3>
                        
                        {/* Source URL */}
                        {url && (
                            <a 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[#FF4D00] hover:text-[#E64400] text-sm font-medium inline-flex items-center group mb-3"
                            >
                                <Link2 className="w-3 h-3 mr-1" />
                                <span className="truncate max-w-sm">{url}</span>
                                <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        )}

                        {/* Image Thumbnails */}
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-3">
                                {images.slice(0, 4).map((image, index) => (
                                    <div 
                                        key={index} 
                                        className="w-16 h-16 rounded-lg overflow-hidden border-3 border-white shadow-md hover:z-10 transition-all hover:scale-105"
                                        style={{ zIndex: 4 - index }}
                                    >
                                        <img
                                            src={image}
                                            alt={`Source ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                            {images.length > 4 && (
                                <span className="text-sm text-gray-500 font-medium">
                                    +{images.length - 4} more
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Right Section: Description */}
                    {description && (
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                <FileText className="w-3 h-3 mr-1.5" />
                                Description
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                {displayDescription}
                                {shouldTruncate && (
                                    <button
                                        onClick={() => setExpandedDescription(!expandedDescription)}
                                        className="inline-flex items-center text-xs text-[#FF4D00] hover:text-[#E64400] font-medium ml-2"
                                    >
                                        {expandedDescription ? (
                                            <>Show less <ChevronUp className="w-3 h-3 ml-1" /></>
                                        ) : (
                                            <>Show more <ChevronDown className="w-3 h-3 ml-1" /></>
                                        )}
                                    </button>
                                )}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}