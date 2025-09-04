import { useState } from 'react';
import { Share2, Copy, Check, X } from 'lucide-react';
import axios from 'axios';

interface ShareButtonProps {
    productId: string;
    productName: string;
    size?: 'sm' | 'md';
}

export default function ShareButton({ productId, productName, size = 'md' }: ShareButtonProps) {
    const [showModal, setShowModal] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const handleShare = async () => {
        setShowModal(true);
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`/products/${productId}/share`);
            setShareUrl(response.data.share_url);
        } catch (err) {
            console.error('Failed to create share link:', err);
            setError('Failed to create share link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClose = () => {
        setShowModal(false);
        setShareUrl('');
        setCopied(false);
        setError('');
    };

    const buttonSizeClasses = size === 'sm' 
        ? 'px-2 py-1 text-xs gap-1'
        : 'px-4 py-2 text-sm gap-2';
    
    const iconSizeClasses = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

    return (
        <>
            <button
                onClick={handleShare}
                className={`inline-flex items-center ${buttonSizeClasses} bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors`}
            >
                <Share2 className={iconSizeClasses} />
                Share
            </button>

            {/* Share Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Share Product Showcase
                            </h3>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">
                            Share <strong>{productName}</strong> with its AI-generated images
                        </p>

                        {loading && (
                            <div className="py-8 text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#FF4D00] border-t-transparent"></div>
                                <p className="text-sm text-gray-600 mt-2">Creating share link...</p>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {shareUrl && !loading && (
                            <>
                                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={shareUrl}
                                            readOnly
                                            className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                                        />
                                        <button
                                            onClick={handleCopy}
                                            className={`p-2 rounded-lg transition-all ${
                                                copied 
                                                    ? 'bg-green-500 text-white' 
                                                    : 'bg-white hover:bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            {copied ? (
                                                <Check className="w-4 h-4" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <a
                                        href={shareUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 text-center px-4 py-2 bg-[#FF4D00] text-white rounded-lg hover:bg-[#E64400] transition-colors"
                                    >
                                        View Showcase
                                    </a>
                                    <button
                                        onClick={handleClose}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}