import { Link2, Package, FileText, Image, ExternalLink, CheckCircle2 } from 'lucide-react';

interface ProductInfoProps {
    title?: string;
    description?: string;
    url?: string;
    images: string[];
    imageDescriptions?: string[];
}

export default function ProductInfo({ 
    title, 
    description, 
    url, 
    images,
    imageDescriptions 
}: ProductInfoProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm h-full border border-gray-100 overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-gray-50 to-orange-50 p-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <div className="w-8 h-8 bg-[#FF4D00] bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
                        <Package className="w-4 h-4 text-[#FF4D00]" />
                    </div>
                    Product Details
                </h3>
            </div>

            <div className="p-5 space-y-5">
                {/* Product Title */}
                {title && (
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            <Package className="w-3 h-3 mr-1.5" />
                            Title
                        </div>
                        <p className="text-gray-900 font-medium">{title}</p>
                    </div>
                )}

                {/* Product URL */}
                {url && (
                    <div className="bg-blue-50 rounded-lg p-4 group">
                        <div className="flex items-center text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                            <Link2 className="w-3 h-3 mr-1.5" />
                            Source
                        </div>
                        <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:text-blue-900 text-sm font-medium truncate flex items-center group"
                        >
                            <span className="truncate">{url}</span>
                            <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                    </div>
                )}

                {/* Product Description */}
                {description && (
                    <div className="bg-orange-50 rounded-lg p-4">
                        <div className="flex items-center text-xs font-semibold text-orange-600 uppercase tracking-wider mb-2">
                            <FileText className="w-3 h-3 mr-1.5" />
                            Description
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">{description}</p>
                    </div>
                )}

                {/* Source Images */}
                <div className="border-t pt-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            <Image className="w-3 h-3 mr-1.5" />
                            Source Images
                        </div>
                        <span className="bg-[#FF4D00] bg-opacity-10 text-[#FF4D00] text-xs font-semibold px-2 py-1 rounded-full">
                            {images.length} selected
                        </span>
                    </div>
                    
                    <div className="space-y-3">
                        {images.map((image, index) => (
                            <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-white shadow-sm flex-shrink-0 border border-gray-200">
                                    <img
                                        src={image}
                                        alt={`Source ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center mb-1">
                                        <p className="text-sm font-semibold text-gray-900">Image {index + 1}</p>
                                        {imageDescriptions && imageDescriptions[index] && (
                                            <CheckCircle2 className="w-3 h-3 text-green-500 ml-2" />
                                        )}
                                    </div>
                                    {imageDescriptions && imageDescriptions[index] && (
                                        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                                            {imageDescriptions[index]}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Analysis Status */}
                {imageDescriptions && imageDescriptions.length > 0 && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center text-sm">
                            <div className="w-8 h-8 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <p className="text-green-900 font-medium">Analysis Complete</p>
                                <p className="text-green-700 text-xs mt-0.5">All images processed successfully</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}