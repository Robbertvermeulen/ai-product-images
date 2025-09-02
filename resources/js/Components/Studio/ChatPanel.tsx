import { Send, Loader2, MessageCircle, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ChatMessage {
    role: string;
    content: string;
}

interface ChatPanelProps {
    chatHistory: ChatMessage[];
    onSendMessage: (message: string) => void;
    isGenerating: boolean;
}

export default function ChatPanel({ chatHistory, onSendMessage, isGenerating }: ChatPanelProps) {
    const [message, setMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !isGenerating) {
            onSendMessage(message);
            setMessage('');
        }
    };

    const suggestionPrompts = [
        'Make it brighter',
        'Change background to white',
        'Add natural lighting',
        'More modern style',
        'Show more detail',
    ];

    const handleSuggestion = (suggestion: string) => {
        if (!isGenerating) {
            onSendMessage(suggestion);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-orange-50">
                <div className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-[#FF4D00]" />
                    <h3 className="text-lg font-semibold">Refine Your Image</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                    Tell me how to improve the image
                </p>
            </div>

            {/* Quick Suggestions */}
            {chatHistory.length === 0 && (
                <div className="p-4 border-b bg-gray-50">
                    <p className="text-xs text-gray-600 mb-2">Quick refinements:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestionPrompts.map((prompt, index) => (
                            <button
                                key={index}
                                onClick={() => handleSuggestion(prompt)}
                                disabled={isGenerating}
                                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Chat History */}
            <div className="h-64 overflow-y-auto p-4 space-y-4">
                {chatHistory.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                        <Sparkles className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No refinements yet</p>
                        <p className="text-xs mt-1">Type a message or use quick suggestions</p>
                    </div>
                ) : (
                    chatHistory.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-lg ${
                                    msg.role === 'user'
                                        ? 'bg-[#FF4D00] text-white'
                                        : 'bg-gray-100 text-gray-800'
                                }`}
                            >
                                <p className="text-sm">{msg.content}</p>
                            </div>
                        </div>
                    ))
                )}
                {isGenerating && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 p-3 rounded-lg">
                            <div className="flex items-center">
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                <span className="text-sm text-gray-600">Generating refined image...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="E.g., 'Make the lighting warmer' or 'Add a lifestyle context'"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4D00] focus:border-[#FF4D00]"
                        disabled={isGenerating}
                    />
                    <button
                        type="submit"
                        disabled={isGenerating || !message.trim()}
                        className="px-4 py-2 bg-[#FF4D00] text-white rounded-lg hover:bg-[#E64400] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    Each refinement creates a new variation while preserving your product's identity
                </p>
            </form>
        </div>
    );
}