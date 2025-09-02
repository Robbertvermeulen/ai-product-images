import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputSection from '@/Components/Studio/InputSection';
import ImageSelector from '@/Components/Studio/ImageSelector';
import ProductInfoBar from '@/Components/Studio/ProductInfoBar';
import ImageCanvas from '@/Components/Studio/ImageCanvas';
import ChatWithToolkit from '@/Components/Studio/ChatWithToolkit';
import SessionGallery from '@/Components/Studio/SessionGallery';
import Breadcrumb from '@/Components/Breadcrumb';
import { Loader2, Save, Package } from 'lucide-react';

interface Product {
    id: string;
    title?: string;
    name?: string;
    description: string;
    url?: string;
    source_url?: string;
    images: string[];
    selectedImages?: string[];
    imageDescriptions?: string[];
    analysis?: any;
}

interface GeneratedImage {
    id: string;
    url: string;
    prompt: string;
    type: string;
    timestamp: Date;
    alt?: string;
    title?: string;
    revision?: number;
    parentId?: string;
}

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    isShortcut?: boolean;
}

type WorkflowStep = 'input' | 'select-images' | 'analyzing' | 'studio';

export default function Dashboard() {
    const [workflowStep, setWorkflowStep] = useState<WorkflowStep>('input');
    const [activeProduct, setActiveProduct] = useState<Product | null>(null);
    const [activeSession, setActiveSession] = useState<any>(null);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [recommendations, setRecommendations] = useState<string[]>([]);
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
    const [activeGeneratedImage, setActiveGeneratedImage] = useState<GeneratedImage | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState<'square' | 'landscape'>('square');
    const [isSaving, setIsSaving] = useState(false);

    const handleUrlSubmit = (url: string) => {
        const mockProduct: Product = {
            id: Date.now().toString(),
            title: 'Premium Wireless Headphones',
            description: 'High-quality wireless headphones with active noise cancellation, premium sound quality, and exceptional comfort. Features 30-hour battery life, quick charge capability, and seamless connectivity with all your devices. Perfect for travel, work, and everyday listening.',
            url: url,
            images: [
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop',
            ],
            selectedImages: [],
        };
        setActiveProduct(mockProduct);
        setWorkflowStep('select-images');
    };


    const handleImageSelection = (images: string[]) => {
        setSelectedImages(images);
        if (activeProduct) {
            setActiveProduct({ ...activeProduct, selectedImages: images });
            setWorkflowStep('analyzing');
            
            // Simulate analysis
            setTimeout(() => {
                setActiveProduct(prev => prev ? {
                    ...prev,
                    imageDescriptions: images.map((_, index) => 
                        `Analysis ${index + 1}: Product shown at angle with good lighting, clear focus on key features. Background is neutral, suitable for e-commerce listing.`
                    )
                } : null);
                setWorkflowStep('studio');
            }, 2000);
        }
    };

    const handleMethodSelect = (method: 'ai' | 'custom' | 'preset', detail?: string) => {
        if (method === 'ai') {
            if (detail) {
                // User selected a specific recommendation
                setChatHistory(prev => [...prev, {
                    role: 'user' as const,
                    content: `Generate: ${detail}`
                }]);
                generateImage(detail, 'AI Recommended');
            } else {
                // Generate new recommendations (always regenerate when AI is selected)
                setTimeout(() => {
                    setRecommendations([
                        'Lifestyle shot showing the product in daily use',
                        'Detail shot highlighting texture and quality',
                        'Scale comparison with common objects',
                        'Hero shot with gradient background',
                        'Multiple angle views showing all sides',
                    ]);
                }, 1500); // Simulate API call
            }
        } else if (method === 'custom' && detail) {
            setChatHistory(prev => [...prev, {
                role: 'user' as const,
                content: detail
            }]);
            generateImage(detail, 'Custom');
        } else if (method === 'preset' && detail) {
            setChatHistory(prev => [...prev, {
                role: 'user' as const,
                content: `Apply preset: ${detail}`
            }]);
            generateImage(detail, 'Preset');
        }
    };

    const handleSendMessage = (message: string) => {
        setChatHistory(prev => [...prev, { role: 'user', content: message }]);
        setIsGenerating(true);
        
        setTimeout(() => {
            setChatHistory(prev => [...prev, { 
                role: 'assistant', 
                content: 'I\'ll adjust the image based on your feedback.' 
            }]);
            
            if (activeGeneratedImage) {
                // This is a revision of the current image
                const refinedPrompt = `${activeGeneratedImage.prompt} (refined: ${message})`;
                generateImage(refinedPrompt, 'Refined', activeGeneratedImage.id);
            }
            
            setIsGenerating(false);
        }, 2000);
    };

    const handleQuickAction = (action: string, value: string) => {
        let message = '';
        switch (action) {
            case 'aspect':
                message = value === 'square' ? 'Change to square format (1:1)' : 'Change to landscape format (16:9)';
                break;
            case 'size':
                message = `Resize to ${value}px`;
                break;
            case 'style':
                if (value === 'warmer') message = 'Make the lighting warmer and more inviting';
                if (value === 'detail') message = 'Add more detail and sharpness';
                break;
        }
        
        if (message) {
            setChatHistory(prev => [...prev, { 
                role: 'user', 
                content: message,
                isShortcut: true
            }]);
            
            // Simulate generation
            if (activeGeneratedImage) {
                generateImage(`${activeGeneratedImage.prompt} - ${message}`, 'Modified');
            }
        }
    };

    const generateImage = (prompt: string, type: string, parentId?: string) => {
        setIsGenerating(true);
        setChatHistory(prev => [...prev, {
            role: 'assistant',
            content: 'Generating your image...'
        }]);
        
        setTimeout(() => {
            // Calculate revision number if this is a refinement
            const parentImage = parentId ? generatedImages.find(img => img.id === parentId) : null;
            const revision = parentImage ? (parentImage.revision || 1) + 1 : 1;
            
            // Generate smart alt and title based on prompt
            const productName = activeProduct?.name || activeProduct?.title || 'Product';
            const alt = `${productName} - ${type} shot showing ${prompt.toLowerCase().replace(/[^\w\s]/gi, '')}`;
            const title = `${productName} - ${type} Image`;
            
            const newImage: GeneratedImage = {
                id: Date.now().toString(),
                url: type.includes('Lifestyle') 
                    ? 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop'
                    : type.includes('Detail')
                    ? 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop'
                    : type.includes('Hero')
                    ? 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&h=800&fit=crop'
                    : 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=800&fit=crop',
                prompt: prompt,
                type: type,
                timestamp: new Date(),
                alt: alt,
                title: title,
                revision: revision,
                parentId: parentId,
            };
            
            setGeneratedImages(prev => [...prev, newImage]);
            setActiveGeneratedImage(newImage);
            setChatHistory(prev => [...prev, {
                role: 'assistant',
                content: 'Image generated successfully! You can now refine it or generate another.'
            }]);
            setIsGenerating(false);
        }, 3000);
    };

    const handleImageSelect = (image: GeneratedImage) => {
        setActiveGeneratedImage(image);
    };

    const handleUndo = () => {
        if (activeGeneratedImage?.parentId) {
            const parentImage = generatedImages.find(img => img.id === activeGeneratedImage.parentId);
            if (parentImage) {
                setActiveGeneratedImage(parentImage);
            }
        }
    };

    const handleRedo = () => {
        // Find the most recent child of the current image
        const childImage = generatedImages
            .filter(img => img.parentId === activeGeneratedImage?.id)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
        
        if (childImage) {
            setActiveGeneratedImage(childImage);
        }
    };

    const handleViewHistory = () => {
        // This could open a modal showing the revision tree
        console.log('View revision history for:', activeGeneratedImage);
    };

    const hasParent = () => {
        return activeGeneratedImage?.parentId && 
               generatedImages.some(img => img.id === activeGeneratedImage.parentId);
    };

    const hasChildren = () => {
        return generatedImages.some(img => img.parentId === activeGeneratedImage?.id);
    };

    const handleFormatSelect = (format: 'square' | 'landscape') => {
        setSelectedFormat(format);
    };

    const saveSession = async () => {
        // Mock save session for now
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            console.log('Session saved');
        }, 1000);
    };

    const resetWorkflow = () => {
        setWorkflowStep('input');
        setActiveProduct(null);
        setActiveSession(null);
        setSelectedImages([]);
        setRecommendations([]);
        setGeneratedImages([]);
        setActiveGeneratedImage(null);
        setChatHistory([]);
        setSelectedFormat('square');
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    AI Image Studio
                </h2>
            }
        >
            <Head title="Studio - ProductImage" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Input Phase */}
                    {workflowStep === 'input' && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <InputSection
                                onUrlSubmit={handleUrlSubmit}
                            />
                        </div>
                    )}

                    {/* Image Selection Phase */}
                    {workflowStep === 'select-images' && activeProduct && (
                        <ImageSelector
                            images={activeProduct.images}
                            onSelectionComplete={handleImageSelection}
                        />
                    )}

                    {/* Analysis Phase */}
                    {workflowStep === 'analyzing' && (
                        <div className="bg-white rounded-lg shadow-sm p-12">
                            <div className="text-center">
                                <Loader2 className="w-12 h-12 animate-spin mx-auto text-[#FF4D00] mb-4" />
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Images</h2>
                                <p className="text-gray-600">Understanding your product to provide the best recommendations...</p>
                            </div>
                        </div>
                    )}

                    {/* Studio Interface */}
                    {workflowStep === 'studio' && activeProduct && (
                        <div className="space-y-6">
                            {/* Breadcrumb & Actions */}
                            <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                                <Breadcrumb
                                    items={[
                                        { label: 'Products', href: '/products' },
                                        { label: activeProduct.name || activeProduct.title },
                                    ]}
                                />
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={saveSession}
                                        disabled={isSaving}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        Save Session
                                    </button>
                                    <Link
                                        href="/products"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF4D00] text-white rounded-lg hover:bg-[#E64400]"
                                    >
                                        <Package className="w-4 h-4" />
                                        Switch Product
                                    </Link>
                                </div>
                            </div>

                            {/* Product Info Bar */}
                            <ProductInfoBar
                                title={activeProduct.name || activeProduct.title}
                                description={activeProduct.description}
                                url={activeProduct.source_url || activeProduct.url}
                                images={selectedImages.length > 0 ? selectedImages : activeProduct.selectedImages}
                                imageDescriptions={activeProduct.analysis?.imageDescriptions || activeProduct.imageDescriptions}
                            />

                            {/* Main Studio Area - Blended Layout */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                                    {/* Chat with Toolkit - Left Side */}
                                    <div className="border-r border-gray-100">
                                        <ChatWithToolkit
                                            onMethodSelect={(method, detail) => {
                                                // Clear recommendations when switching methods
                                                if (method === 'ai' && !detail) {
                                                    setRecommendations([]);
                                                }
                                                handleMethodSelect(method, detail);
                                            }}
                                            onSendMessage={handleSendMessage}
                                            onQuickAction={handleQuickAction}
                                            chatHistory={chatHistory}
                                            isGenerating={isGenerating}
                                            recommendations={recommendations}
                                            onFormatSelect={handleFormatSelect}
                                        />
                                    </div>

                                    {/* Image Canvas - Right Side */}
                                    <div className="bg-gray-50">
                                        <ImageCanvas
                                            image={activeGeneratedImage?.url || null}
                                            isGenerating={isGenerating}
                                            prompt={activeGeneratedImage?.prompt}
                                            imageType={activeGeneratedImage?.type}
                                            timestamp={activeGeneratedImage?.timestamp}
                                            alt={activeGeneratedImage?.alt}
                                            title={activeGeneratedImage?.title}
                                            revision={activeGeneratedImage?.revision}
                                            parentId={activeGeneratedImage?.parentId}
                                            hasParent={hasParent()}
                                            hasChildren={hasChildren()}
                                            onDownload={() => console.log('Download')}
                                            onRegenerate={() => {
                                                if (activeGeneratedImage) {
                                                    generateImage(activeGeneratedImage.prompt, 'Regenerated', activeGeneratedImage.id);
                                                }
                                            }}
                                            onUndo={handleUndo}
                                            onRedo={handleRedo}
                                            onViewHistory={handleViewHistory}
                                            selectedFormat={selectedFormat}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Session Gallery - Always visible */}
                            <SessionGallery
                                images={generatedImages}
                                activeImageId={activeGeneratedImage?.id || null}
                                onImageSelect={handleImageSelect}
                                onImageDownload={(image) => console.log('Download:', image)}
                                onImageDelete={(id) => {
                                    setGeneratedImages(prev => prev.filter(img => img.id !== id));
                                    if (activeGeneratedImage?.id === id) {
                                        setActiveGeneratedImage(generatedImages[0] || null);
                                    }
                                }}
                                onAddNew={() => {
                                    // Reset to generation methods
                                    setChatHistory([]);
                                    setRecommendations([]);
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}