import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Textarea } from '@/Components/ui/textarea';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { 
    Loader2, 
    Wand2, 
    Download,
    RefreshCw,
    Sparkles,
    Image as ImageIcon,
    Copy,
    Check
} from 'lucide-react';
import axios from 'axios';

interface GeneratedImage {
    id: string;
    url: string;
    prompt: string;
    recommendation: string;
    version: number;
    created_at: string;
}

interface StudioSession {
    id: string;
    name: string;
    status: string;
    product_id: string;
    generated_images: GeneratedImage[];
}

interface Props {
    auth: any;
    session: StudioSession;
    recommendation?: string;
}

export default function StudioSessionPage({ auth, session, recommendation }: Props) {
    const [prompt, setPrompt] = useState('');
    const [generatingPrompt, setGeneratingPrompt] = useState(false);
    const [generatingImage, setGeneratingImage] = useState(false);
    const [currentRecommendation, setCurrentRecommendation] = useState(recommendation || '');
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>(session.generated_images || []);
    const [feedback, setFeedback] = useState('');
    const [copiedPrompt, setCopiedPrompt] = useState(false);
    const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

    useEffect(() => {
        // Get recommendation from URL params if not passed as prop
        if (!currentRecommendation) {
            const urlParams = new URLSearchParams(window.location.search);
            const rec = urlParams.get('recommendation');
            if (rec) {
                setCurrentRecommendation(rec);
            }
        }
    }, []);

    useEffect(() => {
        // Auto-generate prompt if we have a recommendation
        if (currentRecommendation && !prompt) {
            generatePrompt();
        }
    }, [currentRecommendation]);

    const generatePrompt = async () => {
        if (!currentRecommendation) return;
        
        setGeneratingPrompt(true);
        try {
            const response = await axios.post(`/api/studio/sessions/${session.id}/prompt`, {
                recommendation: currentRecommendation,
                use_style_reference: true
            });
            setPrompt(response.data.prompt);
        } catch (error) {
            console.error('Failed to generate prompt:', error);
        } finally {
            setGeneratingPrompt(false);
        }
    };

    const generateImage = async () => {
        setGeneratingImage(true);
        try {
            const response = await axios.post(`/api/studio/sessions/${session.id}/generate`, {
                prompt,
                recommendation: currentRecommendation,
                size: '1024x1024'
            });
            
            const newImage = response.data;
            setGeneratedImages(prev => [newImage, ...prev]);
            setSelectedImage(newImage);
        } catch (error) {
            console.error('Failed to generate image:', error);
        } finally {
            setGeneratingImage(false);
        }
    };

    const refinePrompt = async () => {
        if (!selectedImage || !feedback) return;
        
        setGeneratingPrompt(true);
        try {
            const response = await axios.post(`/api/studio/images/${selectedImage.id}/refine`, {
                feedback
            });
            setPrompt(response.data.refined_prompt);
            setFeedback('');
        } catch (error) {
            console.error('Failed to refine prompt:', error);
        } finally {
            setGeneratingPrompt(false);
        }
    };

    const copyPrompt = () => {
        navigator.clipboard.writeText(prompt);
        setCopiedPrompt(true);
        setTimeout(() => setCopiedPrompt(false), 2000);
    };

    const downloadImage = (url: string, filename: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">AI Studio</h2>
                    <Badge className="bg-orange-500">
                        {generatedImages.length} Images Generated
                    </Badge>
                </div>
            }
        >
            <Head title="AI Studio" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Controls */}
                        <div className="space-y-6">
                            {currentRecommendation && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Recommendation</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-700">{currentRecommendation}</p>
                                    </CardContent>
                                </Card>
                            )}

                            <Card>
                                <CardHeader>
                                    <CardTitle>DALL-E Prompt</CardTitle>
                                    <CardDescription>
                                        Fine-tune your prompt for the best results
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="relative">
                                        <Textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="Enter your DALL-E prompt..."
                                            className="min-h-[120px] pr-10"
                                            disabled={generatingPrompt || generatingImage}
                                        />
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={copyPrompt}
                                            className="absolute top-2 right-2"
                                        >
                                            {copiedPrompt ? (
                                                <Check className="h-4 w-4" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <Button 
                                            onClick={generatePrompt}
                                            variant="outline"
                                            disabled={generatingPrompt || !currentRecommendation}
                                        >
                                            {generatingPrompt ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <RefreshCw className="mr-2 h-4 w-4" />
                                            )}
                                            Regenerate Prompt
                                        </Button>
                                        
                                        <Button 
                                            onClick={generateImage}
                                            disabled={generatingImage || !prompt}
                                            className="flex-1 bg-orange-500 hover:bg-orange-600"
                                        >
                                            {generatingImage ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <Wand2 className="mr-2 h-4 w-4" />
                                                    Generate Image
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {selectedImage && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Refine Prompt</CardTitle>
                                        <CardDescription>
                                            Not happy with the result? Tell us what to change
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Textarea
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            placeholder="E.g., 'Make the lighting warmer' or 'Show more of the product details'"
                                            className="min-h-[80px]"
                                        />
                                        <Button 
                                            onClick={refinePrompt}
                                            disabled={generatingPrompt || !feedback}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            Refine & Update Prompt
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Right Column - Generated Images */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Generated Images</CardTitle>
                                    <CardDescription>
                                        Click on an image to select it for refinement
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {generatingImage && (
                                        <div className="mb-4 p-8 border-2 border-dashed border-gray-300 rounded-lg">
                                            <div className="text-center">
                                                <Loader2 className="h-12 w-12 mx-auto text-orange-500 animate-spin mb-4" />
                                                <p className="text-gray-600">Creating your image...</p>
                                                <p className="text-sm text-gray-500 mt-2">This may take 10-20 seconds</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {generatedImages.length === 0 && !generatingImage && (
                                        <div className="text-center py-12">
                                            <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                            <p className="text-gray-600">No images generated yet</p>
                                            <p className="text-sm text-gray-500 mt-2">
                                                Generate your first image using the prompt above
                                            </p>
                                        </div>
                                    )}
                                    
                                    <div className="grid gap-4">
                                        {generatedImages.map((image) => (
                                            <div 
                                                key={image.id}
                                                className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                                    selectedImage?.id === image.id 
                                                        ? 'border-orange-500 shadow-lg' 
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                                onClick={() => setSelectedImage(image)}
                                            >
                                                <img 
                                                    src={image.url}
                                                    alt="Generated product image"
                                                    className="w-full"
                                                />
                                                <div className="absolute top-2 left-2 right-2 flex justify-between">
                                                    <Badge variant="secondary" className="bg-white/90">
                                                        Version {image.version}
                                                    </Badge>
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            downloadImage(image.url, `generated-v${image.version}.png`);
                                                        }}
                                                        className="bg-white/90 hover:bg-white"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <p className="text-white text-sm line-clamp-2">{image.prompt}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}