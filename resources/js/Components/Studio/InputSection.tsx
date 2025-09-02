import { useState } from 'react';
import { Link2, Loader2 } from 'lucide-react';

interface InputSectionProps {
    onUrlSubmit: (url: string) => void;
}

export default function InputSection({ onUrlSubmit }: InputSectionProps) {
    const [url, setUrl] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleUrlSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url.trim()) {
            setIsProcessing(true);
            onUrlSubmit(url);
            setTimeout(() => {
                setUrl('');
                setIsProcessing(false);
            }, 1000);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Start Creating Product Images</h1>
                <p className="mt-2 text-gray-600">
                    Enter a product URL to generate missing shots
                </p>
            </div>

            {/* URL Input */}
            <form onSubmit={handleUrlSubmit} className="max-w-2xl mx-auto">
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Link2 className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com/product"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4D00] focus:border-[#FF4D00]"
                            disabled={isProcessing}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="px-6 py-3 bg-[#FF4D00] text-white font-medium rounded-lg hover:bg-[#E64400] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {isProcessing ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            'Analyze'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}