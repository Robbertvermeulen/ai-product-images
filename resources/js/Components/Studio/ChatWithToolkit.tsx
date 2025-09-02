import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Edit3, Grid3X3, Loader2, ChevronRight, Square, RectangleHorizontal } from 'lucide-react';

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    isShortcut?: boolean;
}

interface ChatWithToolkitProps {
    onMethodSelect: (method: 'ai' | 'custom' | 'preset', detail?: string) => void;
    onSendMessage: (message: string) => void;
    onQuickAction: (action: string, value: string) => void;
    chatHistory: ChatMessage[];
    isGenerating: boolean;
    recommendations?: string[];
    presets?: Array<{ id: string; name: string; prompt: string }>;
}

export default function ChatWithToolkit({ 
    onMethodSelect,
    onSendMessage,
    onQuickAction,
    chatHistory,
    isGenerating,
    recommendations = [],
    presets = [],
    onFormatSelect
}: ChatWithToolkitProps) {
    const [showToolkit, setShowToolkit] = useState(true);
    const [selectedFormat, setSelectedFormat] = useState<'square' | 'landscape' | null>(null);
    const [selectedMethod, setSelectedMethod] = useState<'ai' | 'custom' | 'preset' | null>(null);
    const [message, setMessage] = useState('');
    const [customPrompt, setCustomPrompt] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    // Reset to toolkit when chat history is cleared
    useEffect(() => {
        if (chatHistory.length === 0) {
            setShowToolkit(true);
            setSelectedFormat(null);
            setSelectedMethod(null);
        }
    }, [chatHistory]);

    const handleMethodSelect = (method: 'ai' | 'custom' | 'preset') => {
        setSelectedMethod(method);
        if (method === 'ai') {
            // Always trigger recommendation generation when AI is selected
            onMethodSelect('ai');
        }
    };

    const handleRecommendationSelect = (recommendation: string) => {
        onMethodSelect('ai', recommendation);
        setShowToolkit(false);
        setSelectedMethod(null);
    };

    const handleFormatSelect = (format: 'square' | 'landscape') => {
        setSelectedFormat(format);
        onFormatSelect?.(format);
    };

    const handlePresetSelect = (preset: { id: string; name: string; prompt: string }) => {
        onMethodSelect('preset', preset.prompt);
        setShowToolkit(false);
        setSelectedMethod(null);
    };

    const handleCustomSubmit = () => {
        if (customPrompt.trim()) {
            onMethodSelect('custom', customPrompt);
            setCustomPrompt('');
            setShowToolkit(false);
            setSelectedMethod(null);
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !isGenerating) {
            onSendMessage(message);
            setMessage('');
        }
    };

    const handleBack = () => {
        if (selectedMethod) {
            setSelectedMethod(null);
        } else if (selectedFormat) {
            setSelectedFormat(null);
        }
    };

    const defaultPresets = [
        { id: 'lifestyle', name: 'Lifestyle Shot', prompt: 'Lifestyle shot showing product in daily use' },
        { id: 'detail', name: 'Detail Close-up', prompt: 'Close-up detail shot highlighting quality and texture' },
        { id: 'hero', name: 'Hero Shot', prompt: 'Hero shot with professional gradient background' },
        { id: 'scale', name: 'Scale Reference', prompt: 'Product with common objects for size reference' },
    ];

    const displayPresets = presets.length > 0 ? presets : defaultPresets;

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-white">
                <h3 className="text-sm font-semibold text-gray-900">Generation Studio</h3>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {showToolkit && chatHistory.length === 0 ? (
                    /* Generation Toolkit */
                    <div className="p-6 overflow-y-auto">
                        {!selectedFormat ? (
                            /* Format Selection */
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Canvas</h3>
                                    <p className="text-sm text-gray-600 mb-6">Select the image format for your product shot:</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleFormatSelect('square')}
                                        className="p-6 border-2 border-gray-200 rounded-lg hover:border-[#FF4D00] hover:bg-orange-50 transition-all group"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-100">
                                                <Square className="w-10 h-10 text-gray-600 group-hover:text-[#FF4D00]" />
                                            </div>
                                            <h4 className="font-semibold text-gray-900 mb-1">Square</h4>
                                            <p className="text-xs text-gray-600">1:1 Ratio</p>
                                            <p className="text-xs text-gray-500 mt-1">Perfect for Instagram & thumbnails</p>
                                        </div>
                                    </button>
                                    
                                    <button
                                        onClick={() => handleFormatSelect('landscape')}
                                        className="p-6 border-2 border-gray-200 rounded-lg hover:border-[#FF4D00] hover:bg-orange-50 transition-all group"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-100">
                                                <RectangleHorizontal className="w-10 h-10 text-gray-600 group-hover:text-[#FF4D00]" />
                                            </div>
                                            <h4 className="font-semibold text-gray-900 mb-1">Landscape</h4>
                                            <p className="text-xs text-gray-600">16:9 Ratio</p>
                                            <p className="text-xs text-gray-500 mt-1">Ideal for banners & hero images</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        ) : !selectedMethod ? (
                            /* Method Selection */
                            <div className="space-y-3">
                                <button
                                    onClick={handleBack}
                                    className="text-sm text-gray-500 hover:text-gray-700 mb-4"
                                >
                                    ← Back to format
                                </button>
                                
                                <div className="bg-gray-50 rounded-lg px-4 py-2 mb-4">
                                    <p className="text-sm text-gray-600">
                                        Format: <span className="font-semibold text-gray-900">
                                            {selectedFormat === 'square' ? 'Square (1:1)' : 'Landscape (16:9)'}
                                        </span>
                                    </p>
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-4">Choose how you want to generate your image:</p>
                                
                                <button
                                    onClick={() => handleMethodSelect('ai')}
                                    className="w-full p-4 border border-gray-200 rounded-lg hover:border-[#FF4D00] hover:bg-orange-50 transition-all text-left group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-[#FF4D00] to-[#FF8C00] rounded-lg flex items-center justify-center">
                                                <Sparkles className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">AI Recommendations</h4>
                                                <p className="text-sm text-gray-600">Get smart suggestions based on your product</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#FF4D00]" />
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleMethodSelect('custom')}
                                    className="w-full p-4 border border-gray-200 rounded-lg hover:border-[#FF4D00] hover:bg-orange-50 transition-all text-left group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                                <Edit3 className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Custom Prompt</h4>
                                                <p className="text-sm text-gray-600">Describe exactly what you want</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#FF4D00]" />
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleMethodSelect('preset')}
                                    className="w-full p-4 border border-gray-200 rounded-lg hover:border-[#FF4D00] hover:bg-orange-50 transition-all text-left group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                                <Grid3X3 className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Common Presets</h4>
                                                <p className="text-sm text-gray-600">Quick templates for e-commerce</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#FF4D00]" />
                                    </div>
                                </button>
                            </div>
                        ) : (
                            /* Selected Method Details */
                            <div>
                                <button
                                    onClick={handleBack}
                                    className="text-sm text-gray-500 hover:text-gray-700 mb-4"
                                >
                                    ← Back to methods
                                </button>
                                
                                <div className="bg-gray-50 rounded-lg px-4 py-2 mb-4">
                                    <p className="text-sm text-gray-600">
                                        Format: <span className="font-semibold text-gray-900">
                                            {selectedFormat === 'square' ? 'Square (1:1)' : 'Landscape (16:9)'}
                                        </span>
                                    </p>
                                </div>

                                {/* AI Recommendations */}
                                {selectedMethod === 'ai' && (
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">AI Recommendations</h4>
                                        {recommendations.length > 0 ? (
                                            <div className="space-y-2">
                                                {recommendations.map((rec, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleRecommendationSelect(rec)}
                                                        className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-orange-50 hover:border-[#FF4D00] border border-transparent rounded-lg text-sm transition-all"
                                                    >
                                                        {rec}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-4">
                                                <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#FF4D00] mb-2" />
                                                <p className="text-sm text-gray-600">Generating recommendations...</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Custom Prompt */}
                                {selectedMethod === 'custom' && (
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">Custom Prompt</h4>
                                        <textarea
                                            value={customPrompt}
                                            onChange={(e) => setCustomPrompt(e.target.value)}
                                            placeholder="E.g., Product on marble surface with soft natural lighting, shot from above..."
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF4D00] focus:border-[#FF4D00]"
                                            rows={4}
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleCustomSubmit}
                                            disabled={!customPrompt.trim()}
                                            className="w-full mt-3 px-4 py-2 bg-[#FF4D00] text-white rounded-lg hover:bg-[#E64400] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                                        >
                                            Generate Image
                                        </button>
                                    </div>
                                )}

                                {/* Presets */}
                                {selectedMethod === 'preset' && (
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">Choose a Preset</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {displayPresets.map((preset) => (
                                                <button
                                                    key={preset.id}
                                                    onClick={() => handlePresetSelect(preset)}
                                                    className="p-4 bg-gray-50 hover:bg-orange-50 border-2 border-transparent hover:border-[#FF4D00] rounded-lg transition-all text-left"
                                                >
                                                    <p className="font-semibold text-gray-900 text-sm mb-1">{preset.name}</p>
                                                    <p className="text-xs text-gray-600 line-clamp-2">{preset.prompt}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Chat Interface */
                    <>
                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {chatHistory.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] px-4 py-2 rounded-lg ${
                                            msg.role === 'user'
                                                ? msg.isShortcut 
                                                    ? 'bg-orange-100 text-orange-900 text-sm'
                                                    : 'bg-[#FF4D00] text-white'
                                                : msg.role === 'system'
                                                ? 'bg-blue-50 text-blue-900 text-sm italic'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        <p className="text-sm">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                            {isGenerating && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 px-4 py-2 rounded-lg">
                                        <div className="flex items-center">
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            <span className="text-sm text-gray-600">Generating...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Form */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Refine your image..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF4D00] focus:border-[#FF4D00]"
                                    disabled={isGenerating}
                                />
                                <button
                                    type="submit"
                                    disabled={isGenerating || !message.trim()}
                                    className="px-4 py-2 bg-[#FF4D00] text-white rounded-lg hover:bg-[#E64400] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            {chatHistory.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowToolkit(true);
                                        setSelectedFormat(null);
                                        setSelectedMethod(null);
                                    }}
                                    className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                                >
                                    ← New generation method
                                </button>
                            )}
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}