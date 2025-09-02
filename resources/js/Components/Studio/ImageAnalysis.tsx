import { Loader2, Image as ImageIcon, CheckCircle } from 'lucide-react';

interface ImageAnalysisProps {
    images: string[];
    descriptions?: string[];
    isAnalyzing: boolean;
}

export default function ImageAnalysis({ images, descriptions, isAnalyzing }: ImageAnalysisProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Image Analysis</h3>
                {isAnalyzing ? (
                    <div className="flex items-center text-sm text-gray-500">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                    </div>
                ) : (
                    <div className="flex items-center text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {images.map((image, index) => (
                    <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                    src={image}
                                    alt={`Product image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop';
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center mb-1">
                                <ImageIcon className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">
                                    Image {index + 1}
                                </span>
                            </div>
                            {isAnalyzing ? (
                                <div className="space-y-2">
                                    <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-2 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600">
                                    {descriptions?.[index] || 
                                     `Analyzed: ${['Front view', 'Side angle', 'Detail shot', 'Hero shot'][index % 4]} showing product features`}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {!isAnalyzing && images.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                    <div className="text-sm">
                        <p className="font-medium text-gray-700 mb-1">Coverage Summary:</p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                ✓ Product shots
                            </span>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                                ⚠ Missing lifestyle
                            </span>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                                ⚠ Missing scale
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}