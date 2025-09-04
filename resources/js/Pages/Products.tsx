import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Package, Plus, Clock, Image, ExternalLink, ChevronRight, Share2 } from 'lucide-react';
import ShareButton from '@/Components/Studio/ShareButton';

interface Product {
    id: string;
    name: string;
    description: string;
    source_url: string;
    thumbnail: string | null;
    images_count: number;
    generated_images_count: number;
    studio_sessions_count: number;
    last_session_at: string | null;
    has_active_session: boolean;
    created_at: string;
}

interface ProductsProps {
    products: Product[];
}

export default function Products({ products }: ProductsProps) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Products
                </h2>
            }
        >
            <Head title="Products" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {products.length === 0 ? (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-12 text-center">
                                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No products yet
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Start by adding your first product to generate amazing images
                                </p>
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF4D00] text-white rounded-lg hover:bg-[#E64400] transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Your First Product
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                                >
                                    {/* Product Image */}
                                    <div className="aspect-square bg-gray-100 relative">
                                        {product.thumbnail ? (
                                            <img
                                                src={product.thumbnail}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-20 h-20 text-gray-300" />
                                            </div>
                                        )}
                                        {product.has_active_session && (
                                            <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                                                Active Session
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-1 truncate">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {product.description}
                                        </p>

                                        {/* Stats */}
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                            <div className="flex items-center gap-1">
                                                <Image className="w-3 h-3" />
                                                <span>{product.images_count} original</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Image className="w-3 h-3 text-[#FF4D00]" />
                                                <span>{product.generated_images_count} generated</span>
                                            </div>
                                        </div>

                                        {/* Last Session Info */}
                                        {product.last_session_at && (
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                                                <Clock className="w-3 h-3" />
                                                <span>Last session: {product.last_session_at}</span>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={product.source_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-gray-500 hover:text-[#FF4D00] flex items-center gap-1"
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                    View Source
                                                </a>
                                                {product.generated_images_count > 0 && (
                                                    <ShareButton 
                                                        productId={product.id} 
                                                        productName={product.name}
                                                        size="sm"
                                                    />
                                                )}
                                            </div>
                                            <Link
                                                href={`/products/${product.id}/studio`}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FF4D00] text-white text-sm rounded-lg hover:bg-[#E64400] transition-colors"
                                            >
                                                {product.has_active_session ? 'Continue' : 'Start Studio'}
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}