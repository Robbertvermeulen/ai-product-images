import { Sparkles, Edit3, Grid3X3 } from 'lucide-react';

interface GenerationMethodSelectorProps {
    onMethodSelect: (method: 'ai' | 'custom' | 'preset') => void;
}

export default function GenerationMethodSelector({ onMethodSelect }: GenerationMethodSelectorProps) {
    const methods = [
        {
            id: 'ai',
            title: 'AI Recommendations',
            description: 'Let AI analyze your product and suggest the best shots to create',
            icon: Sparkles,
            color: 'bg-gradient-to-br from-purple-500 to-pink-500',
        },
        {
            id: 'custom',
            title: 'Custom Prompt',
            description: 'Describe exactly what kind of image you want to generate',
            icon: Edit3,
            color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
        },
        {
            id: 'preset',
            title: 'Choose Preset',
            description: 'Select from pre-defined shot types like lifestyle, detail, or hero shots',
            icon: Grid3X3,
            color: 'bg-gradient-to-br from-orange-500 to-red-500',
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">How would you like to generate images?</h2>
                <p className="text-gray-600">Choose your preferred method for creating new product shots</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {methods.map((method) => (
                    <button
                        key={method.id}
                        onClick={() => onMethodSelect(method.id as 'ai' | 'custom' | 'preset')}
                        className="group relative overflow-hidden rounded-xl border-2 border-gray-200 hover:border-[#FF4D00] transition-all hover:shadow-lg"
                    >
                        <div className="p-6 text-left">
                            <div className={`w-12 h-12 rounded-lg ${method.color} flex items-center justify-center mb-4`}>
                                <method.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {method.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {method.description}
                            </p>
                        </div>
                        
                        {/* Hover Effect */}
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-[#FF4D00] transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
                    </button>
                ))}
            </div>
        </div>
    );
}