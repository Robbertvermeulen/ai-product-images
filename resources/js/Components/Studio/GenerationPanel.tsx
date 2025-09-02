import { Loader2, Download, Share2, Maximize2, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface GenerationPanelProps {
    recommendation: string;
    generatedImage: string | null;
    isGenerating: boolean;
    existingImages: string[];
}

export default function GenerationPanel({ 
    recommendation, 
    generatedImage, 
    isGenerating,
    existingImages 
}: GenerationPanelProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleDownload = () => {
        if (generatedImage) {
            // In real app, this would download the actual image
            const link = document.createElement('a');
            link.href = generatedImage;
            link.download = 'generated-image.png';
            link.click();
        }
    };

    const handleShare = () => {
        // In real app, this would open share dialog
        console.log('Share image');
    };

    const handleRegenerate = () => {
        console.log('Regenerate image');
    };

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Image Generation</h3>
                        <p className="text-sm text-gray-600">
                            Generating: <span className="font-medium">{recommendation}</span>
                        </p>
                    </div>
                    {generatedImage && (
                        <div className="flex gap-2">
                            <button
                                onClick={handleRegenerate}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                title="Regenerate"
                            >
                                <RefreshCw className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                title="Fullscreen"
                            >
                                <Maximize2 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleShare}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                title="Share"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleDownload}
                                className="p-2 text-white bg-[#FF4D00] hover:bg-[#E64400] rounded-lg"
                                title="Download"
                            >
                                <Download className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Image Display */}
            <div className={`relative bg-gray-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
                <div className={`${isFullscreen ? 'h-screen' : 'h-96'} flex items-center justify-center p-8`}>
                    {isGenerating ? (
                        <div className="text-center">
                            <Loader2 className="w-12 h-12 animate-spin mx-auto text-[#FF4D00] mb-4" />
                            <p className="text-gray-600 font-medium">Generating your image...</p>
                            <p className="text-sm text-gray-500 mt-2">This usually takes 10-15 seconds</p>
                            <div className="mt-4 max-w-xs mx-auto">
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#FF4D00] rounded-full animate-pulse" 
                                         style={{ width: '60%' }}></div>
                                </div>
                            </div>
                        </div>
                    ) : generatedImage ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <img
                                src={generatedImage}
                                alt="Generated product image"
                                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                                style={{ maxHeight: isFullscreen ? 'calc(100vh - 4rem)' : 'calc(24rem - 4rem)' }}
                            />
                            {isFullscreen && (
                                <button
                                    onClick={() => setIsFullscreen(false)}
                                    className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70"
                                >
                                    Close
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">
                            <p>Image will appear here</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Reference Images */}
            {existingImages.length > 0 && (
                <div className="p-4 border-t bg-gray-50">
                    <p className="text-xs text-gray-600 mb-2">Style reference from existing images:</p>
                    <div className="flex gap-2 overflow-x-auto">
                        {existingImages.slice(0, 3).map((img, index) => (
                            <div key={index} className="flex-shrink-0 w-16 h-16 rounded overflow-hidden">
                                <img
                                    src={img}
                                    alt={`Reference ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Generation Info */}
            {generatedImage && !isGenerating && (
                <div className="p-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-500">Model: gpt-image-1</span>
                            <span className="text-gray-500">Size: 1024x1024</span>
                            <span className="text-gray-500">Quality: HD</span>
                        </div>
                        <span className="text-green-600 font-medium">✓ Generation complete</span>
                    </div>
                </div>
            )}
        </div>
    );
}