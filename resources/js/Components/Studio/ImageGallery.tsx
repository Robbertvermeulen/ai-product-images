import { Download, Share2, Trash2, Clock, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

interface GalleryImage {
    id: string;
    url: string;
    prompt: string;
    created_at: string;
}

interface ImageGalleryProps {
    images: GalleryImage[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        
        if (diffHours < 1) {
            return 'Just now';
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else {
            const diffDays = Math.floor(diffHours / 24);
            return `${diffDays}d ago`;
        }
    };

    const handleDownload = (image: GalleryImage) => {
        const link = document.createElement('a');
        link.href = image.url;
        link.download = `generated-${image.id}.png`;
        link.click();
    };

    const handleShare = (image: GalleryImage) => {
        console.log('Share image:', image.id);
    };

    const handleDelete = (image: GalleryImage) => {
        console.log('Delete image:', image.id);
    };

    if (images.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12">
                <div className="text-center">
                    <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No generated images yet</h3>
                    <p className="text-sm text-gray-500">
                        Your generated images will appear here
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Generated Images</h3>
                        <span className="text-sm text-gray-500">
                            {images.length} {images.length === 1 ? 'image' : 'images'}
                        </span>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image) => (
                            <div
                                key={image.id}
                                className="group relative bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                                onClick={() => setSelectedImage(image)}
                            >
                                <div className="aspect-square">
                                    <img
                                        src={image.url}
                                        alt={image.prompt}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDownload(image);
                                            }}
                                            className="p-2 bg-white rounded-lg hover:bg-gray-100"
                                            title="Download"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleShare(image);
                                            }}
                                            className="p-2 bg-white rounded-lg hover:bg-gray-100"
                                            title="Share"
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(image);
                                            }}
                                            className="p-2 bg-white rounded-lg hover:bg-gray-100"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                </div>

                                {/* Time badge */}
                                <div className="absolute top-2 right-2">
                                    <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {formatDate(image.created_at)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal for selected image */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600">Prompt:</p>
                                    <p className="text-sm font-medium mt-1">{selectedImage.prompt}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="ml-4 text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <img
                                src={selectedImage.url}
                                alt={selectedImage.prompt}
                                className="max-w-full max-h-[70vh] mx-auto"
                            />
                        </div>
                        <div className="p-4 border-t flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                                Generated {formatDate(selectedImage.created_at)}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleShare(selectedImage)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Share
                                </button>
                                <button
                                    onClick={() => handleDownload(selectedImage)}
                                    className="px-4 py-2 bg-[#FF4D00] text-white rounded-lg hover:bg-[#E64400]"
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}