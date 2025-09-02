import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputSection from '@/Components/Studio/InputSection';
import ImageAnalysis from '@/Components/Studio/ImageAnalysis';
import Recommendations from '@/Components/Studio/Recommendations';
import GenerationPanel from '@/Components/Studio/GenerationPanel';
import ChatPanel from '@/Components/Studio/ChatPanel';
import ImageGallery from '@/Components/Studio/ImageGallery';
import { PageProps } from '@/types';

interface Product {
    id: string;
    name: string;
    description: string;
    images: string[];
    image_descriptions?: string[];
    status: string;
}

interface StudioProps extends PageProps {
    products: Product[];
}

export default function Studio({ auth, products }: StudioProps) {
    const [activeProduct, setActiveProduct] = useState<Product | null>(null);
    const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showGallery, setShowGallery] = useState(false);

    const mockRecommendations = [
        'Lifestyle shot showing the product in daily use',
        'Detail shot highlighting texture and quality',
        'Scale comparison with common objects',
        'Hero shot with gradient background',
        'Multiple angle views showing all sides',
    ];

    const handleUrlSubmit = (url: string) => {
        console.log('URL submitted:', url);
        // Mock product creation
        const newProduct: Product = {
            id: Date.now().toString(),
            name: 'New Product',
            description: 'Product from ' + url,
            images: [
                'https://via.placeholder.com/400x400/059669/ffffff?text=New+Product',
            ],
            status: 'analyzing',
        };
        setActiveProduct(newProduct);
        
        // Simulate analysis completion
        setTimeout(() => {
            setActiveProduct(prev => prev ? { ...prev, status: 'ready' } : null);
        }, 2000);
    };

    const handleImageUpload = (files: FileList) => {
        console.log('Images uploaded:', files.length);
        const imageUrls = Array.from(files).map((file, index) => 
            `https://via.placeholder.com/400x400/0891B2/ffffff?text=Upload+${index + 1}`
        );
        
        const newProduct: Product = {
            id: Date.now().toString(),
            name: 'Uploaded Product',
            description: 'Product from uploaded images',
            images: imageUrls,
            status: 'analyzing',
        };
        setActiveProduct(newProduct);
        
        setTimeout(() => {
            setActiveProduct(prev => prev ? { ...prev, status: 'ready' } : null);
        }, 2000);
    };

    const handleRecommendationSelect = (recommendation: string) => {
        setSelectedRecommendation(recommendation);
        setIsGenerating(true);
        
        // Simulate image generation
        setTimeout(() => {
            setGeneratedImage(`https://via.placeholder.com/800x800/8B5CF6/ffffff?text=Generated+Image`);
            setIsGenerating(false);
        }, 3000);
    };

    const handleChatMessage = (message: string) => {
        setChatHistory(prev => [...prev, { role: 'user', content: message }]);
        setIsGenerating(true);
        
        // Simulate refinement
        setTimeout(() => {
            setChatHistory(prev => [...prev, { 
                role: 'assistant', 
                content: 'I\'ll adjust the image based on your feedback.' 
            }]);
            setGeneratedImage(`https://via.placeholder.com/800x800/EC4899/ffffff?text=Refined+Image`);
            setIsGenerating(false);
        }, 2000);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">AI Image Studio</h2>}
        >
            <Head title="Studio" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Input Section */}
                    {!activeProduct && (
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <InputSection
                                onUrlSubmit={handleUrlSubmit}
                                onImageUpload={handleImageUpload}
                            />
                        </div>
                    )}

                    {/* Active Product Analysis */}
                    {activeProduct && (
                        <div className="space-y-6">
                            {/* Product Header */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold">{activeProduct.name}</h3>
                                        <p className="text-gray-600 mt-1">{activeProduct.description}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setActiveProduct(null);
                                            setSelectedRecommendation(null);
                                            setGeneratedImage(null);
                                            setChatHistory([]);
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        Start New
                                    </button>
                                </div>
                            </div>

                            {/* Main Content Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left Column - Analysis & Recommendations */}
                                <div className="space-y-6">
                                    <ImageAnalysis
                                        images={activeProduct.images}
                                        descriptions={activeProduct.image_descriptions}
                                        isAnalyzing={activeProduct.status === 'analyzing'}
                                    />
                                    
                                    {activeProduct.status === 'ready' && (
                                        <Recommendations
                                            recommendations={mockRecommendations}
                                            selectedRecommendation={selectedRecommendation}
                                            onSelect={handleRecommendationSelect}
                                        />
                                    )}
                                </div>

                                {/* Middle Column - Generation Panel */}
                                <div className="lg:col-span-2 space-y-6">
                                    {selectedRecommendation && (
                                        <>
                                            <GenerationPanel
                                                recommendation={selectedRecommendation}
                                                generatedImage={generatedImage}
                                                isGenerating={isGenerating}
                                                existingImages={activeProduct.images}
                                            />
                                            
                                            {generatedImage && (
                                                <ChatPanel
                                                    chatHistory={chatHistory}
                                                    onSendMessage={handleChatMessage}
                                                    isGenerating={isGenerating}
                                                />
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Gallery Toggle */}
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={() => setShowGallery(!showGallery)}
                                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    {showGallery ? 'Hide' : 'Show'} Generated Images Gallery
                                </button>
                            </div>

                            {/* Image Gallery */}
                            {showGallery && (
                                <ImageGallery
                                    images={[
                                        {
                                            id: '1',
                                            url: generatedImage || 'https://via.placeholder.com/400x400',
                                            prompt: selectedRecommendation || 'Generated image',
                                            created_at: new Date().toISOString(),
                                        }
                                    ]}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}