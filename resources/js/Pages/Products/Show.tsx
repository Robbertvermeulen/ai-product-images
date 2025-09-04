import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { 
    Loader2, 
    Check, 
    X, 
    Sparkles, 
    Image as ImageIcon,
    Wand2,
    ArrowRight,
    Info
} from 'lucide-react';
import axios from 'axios';

interface ProductImage {
    id: string;
    url: string;
    analysis?: string;
    is_selected: boolean;
    order: number;
}

interface Product {
    id: string;
    name: string;
    description: string;
    source_url: string;
    status: string;
    product_images: ProductImage[];
}

interface Props {
    auth: any;
    product: Product;
}

export default function ShowProduct({ auth, product }: Props) {
    const [selectedImages, setSelectedImages] = useState<string[]>(
        product.product_images.filter(img => img.is_selected).map(img => img.id)
    );
    const [analyzing, setAnalyzing] = useState(false);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);
    const [recommendations, setRecommendations] = useState<string[]>([]);
    const [analyses, setAnalyses] = useState<any[]>([]);
    const [currentTab, setCurrentTab] = useState('select');

    const toggleImageSelection = (imageId: string) => {
        setSelectedImages(prev => 
            prev.includes(imageId) 
                ? prev.filter(id => id !== imageId)
                : [...prev, imageId]
        );
    };

    const saveSelection = async () => {
        try {
            await axios.post(`/api/products/${product.id}/select-images`, {
                image_ids: selectedImages
            });
            setCurrentTab('analyze');
        } catch (error) {
            console.error('Failed to save selection:', error);
        }
    };

    const analyzeImages = async () => {
        setAnalyzing(true);
        try {
            const response = await axios.post(`/api/products/${product.id}/analyze`);
            setAnalyses(response.data.analyses);
            setCurrentTab('recommend');
        } catch (error) {
            console.error('Failed to analyze images:', error);
        } finally {
            setAnalyzing(false);
        }
    };

    const getRecommendations = async () => {
        setLoadingRecommendations(true);
        try {
            const response = await axios.get(`/api/products/${product.id}/recommendations`);
            setRecommendations(response.data.recommendations);
        } catch (error) {
            console.error('Failed to get recommendations:', error);
        } finally {
            setLoadingRecommendations(false);
        }
    };

    const startStudio = async (recommendation: string) => {
        try {
            // Create studio session
            const sessionResponse = await axios.post(`/api/studio/products/${product.id}/sessions`, {
                name: `Studio - ${recommendation.substring(0, 50)}...`
            });
            
            // Redirect to studio with session and recommendation
            window.location.href = `/studio/${sessionResponse.data.session_id}?recommendation=${encodeURIComponent(recommendation)}`;
        } catch (error) {
            console.error('Failed to start studio:', error);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">{product.name}</h2>
                    <Badge variant={product.status === 'analyzed' ? 'default' : 'secondary'}>
                        {product.status}
                    </Badge>
                </div>
            }
        >
            <Head title={product.name} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="select">
                                <ImageIcon className="mr-2 h-4 w-4" />
                                Select Images
                            </TabsTrigger>
                            <TabsTrigger value="analyze" disabled={selectedImages.length === 0}>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Analyze
                            </TabsTrigger>
                            <TabsTrigger value="recommend" disabled={analyses.length === 0}>
                                <Wand2 className="mr-2 h-4 w-4" />
                                Recommendations
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="select" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Select Product Images</CardTitle>
                                    <CardDescription>
                                        Choose the images you want to analyze. Select your best current product photos.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {product.product_images.map((image) => (
                                            <div 
                                                key={image.id}
                                                className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                                    selectedImages.includes(image.id)
                                                        ? 'border-orange-500 shadow-lg'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                                onClick={() => toggleImageSelection(image.id)}
                                            >
                                                <img 
                                                    src={image.url} 
                                                    alt={`Product image ${image.order + 1}`}
                                                    className="w-full h-40 object-cover"
                                                />
                                                {selectedImages.includes(image.id) && (
                                                    <div className="absolute top-2 right-2 bg-orange-500 text-white rounded-full p-1">
                                                        <Check className="h-4 w-4" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-6 flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                            {selectedImages.length} images selected
                                        </span>
                                        <Button 
                                            onClick={saveSelection}
                                            disabled={selectedImages.length === 0}
                                        >
                                            Continue to Analysis
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="analyze" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Image Analysis</CardTitle>
                                    <CardDescription>
                                        Our AI will analyze your selected images to understand what shots you already have.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {analyses.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Sparkles className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                            <p className="text-gray-600 mb-4">
                                                Ready to analyze {selectedImages.length} selected images
                                            </p>
                                            <Button onClick={analyzeImages} disabled={analyzing}>
                                                {analyzing ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Analyzing Images...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="mr-2 h-4 w-4" />
                                                        Start Analysis
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {analyses.map((analysis, index) => (
                                                <div key={analysis.image_id} className="flex gap-4 p-4 border rounded-lg">
                                                    <img 
                                                        src={product.product_images.find(img => img.id === analysis.image_id)?.url}
                                                        alt={`Analyzed image ${index + 1}`}
                                                        className="w-24 h-24 object-cover rounded"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="text-sm text-gray-600">{analysis.analysis}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            <Button 
                                                onClick={() => setCurrentTab('recommend')}
                                                className="w-full"
                                            >
                                                Get Recommendations
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="recommend" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Missing Shot Recommendations</CardTitle>
                                    <CardDescription>
                                        Based on your existing images, here are the shots that could improve conversion.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {recommendations.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Wand2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                            <p className="text-gray-600 mb-4">
                                                Get AI recommendations for missing product shots
                                            </p>
                                            <Button onClick={getRecommendations} disabled={loadingRecommendations}>
                                                {loadingRecommendations ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Generating Recommendations...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Wand2 className="mr-2 h-4 w-4" />
                                                        Get Recommendations
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {recommendations.map((recommendation, index) => (
                                                <Card key={index} className="border-orange-200 hover:border-orange-300 transition-colors">
                                                    <CardContent className="p-4">
                                                        <div className="flex justify-between items-start gap-4">
                                                            <div className="flex-1">
                                                                <Badge className="mb-2" variant="outline">
                                                                    Recommendation {index + 1}
                                                                </Badge>
                                                                <p className="text-gray-700">{recommendation}</p>
                                                            </div>
                                                            <Button 
                                                                onClick={() => startStudio(recommendation)}
                                                                size="sm"
                                                                className="bg-orange-500 hover:bg-orange-600"
                                                            >
                                                                <Wand2 className="mr-2 h-4 w-4" />
                                                                Generate
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                            
                                            <Alert>
                                                <Info className="h-4 w-4" />
                                                <AlertDescription>
                                                    Click "Generate" on any recommendation to create AI-powered product images that match your existing style.
                                                </AlertDescription>
                                            </Alert>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}