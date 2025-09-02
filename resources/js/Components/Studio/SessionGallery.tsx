import { Download, Trash2, CheckCircle, Plus, GitBranch, Undo2 } from 'lucide-react';

interface GeneratedImage {
    id: string;
    url: string;
    prompt: string;
    type: string;
    timestamp: Date;
    revision?: number;
    parentId?: string;
}

interface SessionGalleryProps {
    images: GeneratedImage[];
    activeImageId: string | null;
    onImageSelect: (image: GeneratedImage) => void;
    onImageDelete?: (id: string) => void;
    onImageDownload?: (image: GeneratedImage) => void;
    onAddNew?: () => void;
}

export default function SessionGallery({ 
    images, 
    activeImageId,
    onImageSelect,
    onImageDelete,
    onImageDownload,
    onAddNew 
}: SessionGalleryProps) {

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Generated Product Shots</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            {images.length === 0 
                                ? 'Start generating images for your product' 
                                : `${images.length} shot${images.length !== 1 ? 's' : ''} generated`
                            }
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-4 pb-4 pt-2">
                <div className="flex gap-4 overflow-x-auto py-2 scroll-smooth" style={{ paddingBottom: '8px' }}>
                    {/* Add New Button */}
                    {onAddNew && (
                        <div
                            onClick={onAddNew}
                            className="flex-shrink-0 cursor-pointer"
                        >
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-[#FF4D00] transition-all flex items-center justify-center">
                                    <div className="text-center">
                                        <Plus className="w-8 h-8 text-gray-400 group-hover:text-[#FF4D00] mx-auto mb-1" />
                                        <p className="text-xs text-gray-500 group-hover:text-[#FF4D00] font-medium">Add New</p>
                                    </div>
                                </div>
                                <div className="mt-2 px-1">
                                    <p className="text-xs font-medium text-gray-600">Generate</p>
                                    <p className="text-xs text-gray-400">New image</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Generated Images */}
                    {images.map((image) => {
                        const isActive = image.id === activeImageId;
                        return (
                            <div
                                key={image.id}
                                className={`flex-shrink-0 cursor-pointer transition-all ${
                                    isActive ? 'ring-2 ring-[#FF4D00] rounded-lg' : ''
                                }`}
                                onClick={() => onImageSelect(image)}
                            >
                                <div className="relative group">
                                    {/* Image */}
                                    <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                                        <img
                                            src={image.url}
                                            alt={image.prompt}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Indicators */}
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        {image.revision && image.revision > 1 && (
                                            <div className="bg-white/90 backdrop-blur text-gray-700 rounded-full px-2 py-0.5 text-xs font-medium">
                                                v{image.revision}
                                            </div>
                                        )}
                                        {isActive && (
                                            <div className="bg-[#FF4D00] text-white rounded-full p-1">
                                                <CheckCircle className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="flex gap-2">
                                            {onImageDownload && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onImageDownload(image);
                                                    }}
                                                    className="p-2 bg-white rounded-lg hover:bg-gray-100"
                                                    title="Download"
                                                >
                                                    <Download className="w-4 h-4 text-gray-700" />
                                                </button>
                                            )}
                                            {onImageDelete && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onImageDelete(image.id);
                                                    }}
                                                    className="p-2 bg-white rounded-lg hover:bg-red-50"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Image Info */}
                                <div className="mt-2 px-1">
                                    <p className="text-xs font-medium text-gray-900 truncate">
                                        {image.type}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(image.timestamp).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}