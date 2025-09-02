import { Camera, Maximize, Ruler, Star, Package, Users } from 'lucide-react';

interface Preset {
    id: string;
    name: string;
    description: string;
    icon: any;
    prompt: string;
}

interface PresetSelectorProps {
    onPresetSelect: (preset: Preset) => void;
}

export default function PresetSelector({ onPresetSelect }: PresetSelectorProps) {
    const presets: Preset[] = [
        {
            id: 'lifestyle',
            name: 'Lifestyle',
            description: 'Product in real-world use, showing context and purpose',
            icon: Users,
            prompt: 'Lifestyle shot showing the product being used in a real-world context',
        },
        {
            id: 'detail',
            name: 'Detail Shot',
            description: 'Close-up view highlighting texture, quality, and craftsmanship',
            icon: Maximize,
            prompt: 'Detailed close-up shot highlighting product texture and quality',
        },
        {
            id: 'scale',
            name: 'Scale Reference',
            description: 'Product shown with common objects for size comparison',
            icon: Ruler,
            prompt: 'Product with scale reference objects for size comparison',
        },
        {
            id: 'hero',
            name: 'Hero Shot',
            description: 'Premium product presentation with professional background',
            icon: Star,
            prompt: 'Hero shot with gradient background and professional lighting',
        },
        {
            id: 'packaging',
            name: 'Packaging',
            description: 'Product shown with its packaging and unboxing experience',
            icon: Package,
            prompt: 'Product shown with packaging and unboxing presentation',
        },
        {
            id: 'multi-angle',
            name: 'Multi-Angle',
            description: 'Multiple views showing all sides and angles of the product',
            icon: Camera,
            prompt: 'Multiple angle views showing all sides of the product',
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Choose a Preset</h2>
                <p className="text-gray-600">Select a pre-defined shot type for consistent results</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {presets.map((preset) => (
                    <button
                        key={preset.id}
                        onClick={() => onPresetSelect(preset)}
                        className="group text-left p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF4D00] hover:shadow-md transition-all"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF4D00] transition-colors">
                                <preset.icon className="w-5 h-5 text-[#FF4D00] group-hover:text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    {preset.name}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {preset.description}
                                </p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}