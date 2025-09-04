import { Head } from '@inertiajs/react';
import { Download, ExternalLink, ArrowDown, Sparkles, Package, Camera, Maximize2, Users, Palette } from 'lucide-react';
import { useState } from 'react';

interface GeneratedImage {
    id: string;
    url: string;
    title: string;
    justification: string;
    type: 'lifestyle' | 'detail' | 'scale' | 'hero' | 'usage' | 'angle';
}

export default function ShowcasePage() {
    const [showFullDescription, setShowFullDescription] = useState(false);

    // Dummy data for now
    const product = {
        title: "Premium Leather Messenger Bag",
        url: "https://example.com/products/leather-messenger-bag",
        description: "Crafted from genuine Italian leather, this messenger bag combines timeless style with modern functionality. Features multiple compartments, adjustable shoulder strap, and brass hardware. Perfect for professionals who value both aesthetics and practicality. The bag includes a padded laptop compartment that fits up to 15-inch devices, internal organization pockets for accessories, and a secure magnetic closure system.",
        originalImages: [
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=400&h=400&fit=crop",
        ],
        generatedImages: [
            {
                id: "1",
                url: "https://images.unsplash.com/photo-1524738258074-f8125c6a7588?w=600&h=600&fit=crop",
                title: "Lifestyle Shot",
                justification: "Shows the bag in professional daily use, helping customers visualize how it fits into their work routine",
                type: "lifestyle" as const
            },
            {
                id: "2",
                url: "https://images.unsplash.com/photo-1606760227091-3dd870d97e3d?w=600&h=600&fit=crop",
                title: "Detail Close-up",
                justification: "Highlights the premium leather texture and quality brass hardware that justify the price point",
                type: "detail" as const
            },
            {
                id: "3",
                url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop",
                title: "Scale Comparison",
                justification: "Demonstrates actual size relative to a laptop and notebook for better size understanding",
                type: "scale" as const
            },
            {
                id: "4",
                url: "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=600&h=600&fit=crop",
                title: "Hero Shot",
                justification: "Premium positioning shot with professional lighting to attract attention in search results",
                type: "hero" as const
            },
            {
                id: "5",
                url: "https://images.unsplash.com/photo-1622260614153-03223fb72052?w=600&h=600&fit=crop",
                title: "Usage Scene",
                justification: "Shows versatility - from business meetings to coffee shops, expanding target audience",
                type: "usage" as const
            },
            {
                id: "6",
                url: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&h=600&fit=crop",
                title: "Multiple Angles",
                justification: "Provides 360° view to reduce return rates by showing all sides and compartments",
                type: "angle" as const
            }
        ]
    };

    const getIconForType = (type: string) => {
        switch(type) {
            case 'lifestyle': return Users;
            case 'detail': return Camera;
            case 'scale': return Maximize2;
            case 'hero': return Sparkles;
            case 'usage': return Package;
            case 'angle': return Palette;
            default: return Camera;
        }
    };

    const truncatedDescription = product.description.slice(0, 150) + '...';

    return (
        <>
            <Head title="Product Showcase" />
            
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
                {/* Header Section */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            {product.title}
                        </h1>
                        <a 
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-gray-600 hover:text-[#FF4D00] transition-colors"
                        >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            <span className="text-sm">{product.url}</span>
                        </a>
                        <div className="mt-4">
                            <p className="text-gray-700 leading-relaxed">
                                {showFullDescription ? product.description : truncatedDescription}
                            </p>
                            {product.description.length > 150 && (
                                <button
                                    onClick={() => setShowFullDescription(!showFullDescription)}
                                    className="text-[#FF4D00] hover:text-[#E64400] text-sm font-medium mt-2"
                                >
                                    {showFullDescription ? 'Show less' : 'Read more'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Original Images Section */}
                    <div className="mb-12">
                        <div className="text-center mb-8">
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Original Product Images
                            </h2>
                            <div className="flex justify-center">
                                <div className="h-px bg-gray-300 w-24"></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
                            {product.originalImages.map((image, index) => (
                                <div
                                    key={index}
                                    className="aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                                >
                                    <img
                                        src={image}
                                        alt={`Original ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Arrow Indicator */}
                    <div className="flex justify-center mb-12">
                        <div className="flex flex-col items-center">
                            <ArrowDown className="w-8 h-8 text-[#FF4D00] animate-bounce" />
                            <span className="text-sm text-gray-500 mt-2">AI Enhancement</span>
                        </div>
                    </div>

                    {/* Generated Images Section */}
                    <div className="mb-16">
                        <div className="text-center mb-8">
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                AI-Enhanced Product Shots
                            </h2>
                            <div className="flex justify-center">
                                <div className="h-px bg-gradient-to-r from-transparent via-[#FF4D00] to-transparent w-48"></div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {product.generatedImages.map((image) => {
                                const Icon = getIconForType(image.type);
                                return (
                                    <div
                                        key={image.id}
                                        className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        <div className="aspect-square overflow-hidden bg-gray-100">
                                            <img
                                                src={image.url}
                                                alt={image.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-start mb-3">
                                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                                    <Icon className="w-5 h-5 text-[#FF4D00]" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 mb-1">
                                                        {image.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 leading-relaxed">
                                                        {image.justification}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Download Section */}
                    <div className="text-center py-12 border-t border-gray-200">
                        <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF4D00] to-[#FF6B35] text-white font-semibold rounded-xl hover:from-[#E64400] hover:to-[#E65A1F] transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                            <Download className="w-5 h-5" />
                            Download All Images
                        </button>
                        <p className="text-sm text-gray-500 mt-4">
                            Created with{' '}
                            <a href="/" className="text-[#FF4D00] hover:text-[#E64400] font-medium">
                                ProductImageAI.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}