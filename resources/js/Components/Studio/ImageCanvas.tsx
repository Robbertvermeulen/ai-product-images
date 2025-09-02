import { useState } from 'react';
import { Download, Maximize2, RefreshCw, ImagePlus, Loader2, Tag, FileText, Calendar, Layers, Hash, ChevronDown, ChevronUp, Info, Undo2, Redo2, GitBranch } from 'lucide-react';

interface ImageCanvasProps {
    image: string | null;
    isGenerating: boolean;
    prompt?: string;
    imageType?: string;
    timestamp?: Date | string;
    alt?: string;
    title?: string;
    revision?: number;
    parentId?: string;
    hasParent?: boolean;
    hasChildren?: boolean;
    onDownload?: () => void;
    onRegenerate?: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
    onViewHistory?: () => void;
    selectedFormat?: 'square' | 'landscape';
}

export default function ImageCanvas({ 
    image, 
    isGenerating,
    prompt,
    imageType,
    timestamp,
    alt,
    title,
    revision,
    parentId,
    hasParent,
    hasChildren,
    onDownload,
    onRegenerate,
    onUndo,
    onRedo,
    onViewHistory,
    selectedFormat = 'square'
}: ImageCanvasProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showMetadata, setShowMetadata] = useState(false);

    return (
        <>
            <div className="h-full flex flex-col">
                {/* Canvas Header */}
                <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between">
                    <div className="flex items-center">
                        <h3 className="text-sm font-semibold text-gray-900">Canvas</h3>
                        {prompt && !isGenerating && (
                            <span className="ml-3 text-xs text-gray-500 truncate max-w-xs">
                                {prompt}
                            </span>
                        )}
                    </div>
                    {image && !isGenerating && (
                        <div className="flex items-center gap-2">
                            {/* Revision Controls */}
                            <div className="flex items-center gap-1 mr-2 px-2 py-1 bg-gray-100 rounded-lg">
                                {onUndo && (
                                    <button
                                        onClick={onUndo}
                                        disabled={!hasParent}
                                        className="p-1 text-gray-600 hover:text-[#FF4D00] disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                                        title="Go to previous version"
                                    >
                                        <Undo2 className="w-4 h-4" />
                                    </button>
                                )}
                                {revision && (
                                    <span className="px-2 text-xs font-medium text-gray-600">
                                        v{revision}
                                    </span>
                                )}
                                {onRedo && (
                                    <button
                                        onClick={onRedo}
                                        disabled={!hasChildren}
                                        className="p-1 text-gray-600 hover:text-[#FF4D00] disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                                        title="Go to next version"
                                    >
                                        <Redo2 className="w-4 h-4" />
                                    </button>
                                )}
                                {onViewHistory && revision && revision > 1 && (
                                    <button
                                        onClick={onViewHistory}
                                        className="p-1 text-gray-600 hover:text-[#FF4D00] transition-colors ml-1"
                                        title="View revision history"
                                    >
                                        <GitBranch className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            
                            {/* Other Actions */}
                            {onRegenerate && (
                                <button
                                    onClick={onRegenerate}
                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Regenerate"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            )}
                            <button
                                onClick={() => setIsFullscreen(true)}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Fullscreen"
                            >
                                <Maximize2 className="w-4 h-4" />
                            </button>
                            {onDownload && (
                                <button
                                    onClick={onDownload}
                                    className="p-2 text-white bg-[#FF4D00] hover:bg-[#E64400] rounded-lg transition-colors"
                                    title="Download"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Canvas Area */}
                <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
                    {isGenerating ? (
                        <div className="flex flex-col items-center justify-center">
                            <div className="relative w-24 h-24 mx-auto">
                                <div className="w-24 h-24 rounded-full border-4 border-gray-200"></div>
                                <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-[#FF4D00] border-t-transparent animate-spin"></div>
                            </div>
                            <p className="mt-4 text-gray-600 font-medium">Generating your image...</p>
                            <p className="text-sm text-gray-500 mt-1">This usually takes 10-15 seconds</p>
                        </div>
                    ) : image ? (
                        <div className="w-full h-full flex flex-col p-4">
                            <div className="relative flex-1 w-full flex items-center justify-center mb-4">
                                <img
                                    src={image}
                                    alt={alt || prompt || "Generated product image"}
                                    title={title || prompt || "Generated product image"}
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
                                />
                            </div>
                            
                            {/* Collapsible Metadata Panel */}
                            <div className="bg-white rounded-lg border border-gray-200">
                                <button
                                    onClick={() => setShowMetadata(!showMetadata)}
                                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <Info className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700">Image Metadata</span>
                                        {revision && revision > 1 && (
                                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                                                v{revision}
                                            </span>
                                        )}
                                    </div>
                                    {showMetadata ? (
                                        <ChevronUp className="w-4 h-4 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    )}
                                </button>
                                
                                {showMetadata && (
                                    <div className="px-4 pb-4 border-t border-gray-100">
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            {/* Left Column */}
                                            <div className="space-y-3">
                                                {/* Title */}
                                                <div className="flex items-start gap-2">
                                                    <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Title</p>
                                                        <p className="text-sm text-gray-900">
                                                            {title || "Premium Wireless Headphones - Lifestyle Shot"}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                {/* Alt Text */}
                                                <div className="flex items-start gap-2">
                                                    <Tag className="w-4 h-4 text-gray-400 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Alt Text</p>
                                                        <p className="text-sm text-gray-900">
                                                            {alt || "Person wearing premium wireless headphones in modern workspace"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Right Column */}
                                            <div className="space-y-3">
                                                {/* Format & Revision */}
                                                <div className="flex gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <Hash className="w-4 h-4 text-gray-400" />
                                                        <div>
                                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Format</p>
                                                            <p className="text-sm text-gray-900 capitalize">{selectedFormat}</p>
                                                        </div>
                                                    </div>
                                                    {revision && (
                                                        <div className="flex items-center gap-2">
                                                            <Layers className="w-4 h-4 text-gray-400" />
                                                            <div>
                                                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Revision</p>
                                                                <p className="text-sm text-gray-900">v{revision}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Generated Time */}
                                                <div className="flex items-start gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Generated</p>
                                                        <p className="text-sm text-gray-900">
                                                            {timestamp ? new Date(timestamp).toLocaleString() : 'Just now'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Revision History */}
                                        {revision && revision > 1 && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs text-gray-500">
                                                        This is revision {revision} of this image
                                                    </p>
                                                    <button className="text-xs text-[#FF4D00] hover:text-[#E64400] font-medium">
                                                        View History
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                                <ImagePlus className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">Your image will appear here</p>
                            <p className="text-sm text-gray-400 mt-1">Select a generation method to get started</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Fullscreen Modal */}
            {isFullscreen && image && (
                <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-8">
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                        Close
                    </button>
                    <img
                        src={image}
                        alt={prompt || "Generated product image"}
                        title={prompt || "Generated product image"}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            )}
        </>
    );
}