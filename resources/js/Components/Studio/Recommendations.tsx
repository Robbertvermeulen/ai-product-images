import { Sparkles, ArrowRight, Check } from 'lucide-react';

interface RecommendationsProps {
    recommendations: string[];
    selectedRecommendation: string | null;
    onSelect: (recommendation: string) => void;
}

export default function Recommendations({ 
    recommendations, 
    selectedRecommendation, 
    onSelect 
}: RecommendationsProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
                <Sparkles className="w-5 h-5 mr-2 text-[#FF4D00]" />
                <h3 className="text-lg font-semibold">Recommended Shots</h3>
            </div>

            <p className="text-sm text-gray-600 mb-4">
                Click a recommendation to generate that image
            </p>

            <div className="space-y-2">
                {recommendations.map((recommendation, index) => {
                    const isSelected = selectedRecommendation === recommendation;
                    
                    return (
                        <button
                            key={index}
                            onClick={() => onSelect(recommendation)}
                            className={`w-full text-left p-4 rounded-lg transition-all ${
                                isSelected
                                    ? 'bg-orange-50 border-2 border-[#FF4D00]'
                                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className={`text-sm ${
                                        isSelected ? 'text-[#FF4D00] font-medium' : 'text-gray-700'
                                    }`}>
                                        {recommendation}
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            getRecommendationStyle(recommendation)
                                        }`}>
                                            {getRecommendationType(recommendation)}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            High impact
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                    {isSelected ? (
                                        <Check className="w-5 h-5 text-[#FF4D00]" />
                                    ) : (
                                        <ArrowRight className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                    💡 <strong>Pro tip:</strong> Lifestyle and scale shots typically have the highest impact on conversion rates
                </p>
            </div>
        </div>
    );
}

function getRecommendationType(recommendation: string): string {
    const lower = recommendation.toLowerCase();
    if (lower.includes('lifestyle')) return 'Lifestyle';
    if (lower.includes('detail')) return 'Detail';
    if (lower.includes('scale')) return 'Scale';
    if (lower.includes('hero')) return 'Hero';
    if (lower.includes('angle')) return 'Multi-angle';
    return 'Custom';
}

function getRecommendationStyle(recommendation: string): string {
    const type = getRecommendationType(recommendation);
    switch (type) {
        case 'Lifestyle':
            return 'bg-green-100 text-green-700';
        case 'Detail':
            return 'bg-orange-100 text-orange-700';
        case 'Scale':
            return 'bg-orange-100 text-orange-700';
        case 'Hero':
            return 'bg-blue-100 text-blue-700';
        case 'Multi-angle':
            return 'bg-gray-100 text-gray-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
}