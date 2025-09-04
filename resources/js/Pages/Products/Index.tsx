import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Plus, Image as ImageIcon, ExternalLink, Calendar } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    description: string;
    source_url: string;
    status: string;
    thumbnail?: string;
    images_count: number;
    created_at: string;
}

interface Props {
    auth: any;
    products: Product[];
}

export default function ProductsIndex({ auth, products }: Props) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Products</h2>
                    <Link href="/products/create">
                        <Button className="bg-orange-500 hover:bg-orange-600">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="Products" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {products.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                                <p className="text-gray-600 mb-6">
                                    Import your first product to start generating AI-powered images
                                </p>
                                <Link href="/products/create">
                                    <Button className="bg-orange-500 hover:bg-orange-600">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Your First Product
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <Link key={product.id} href={`/products/${product.id}`}>
                                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                                        {product.thumbnail ? (
                                            <div className="h-48 overflow-hidden rounded-t-lg">
                                                <img 
                                                    src={product.thumbnail}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
                                                <ImageIcon className="h-12 w-12 text-gray-400" />
                                            </div>
                                        )}
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-lg line-clamp-1">
                                                    {product.name}
                                                </CardTitle>
                                                <Badge 
                                                    variant={product.status === 'analyzed' ? 'default' : 'secondary'}
                                                    className="ml-2"
                                                >
                                                    {product.status}
                                                </Badge>
                                            </div>
                                            <CardDescription className="line-clamp-2 mt-2">
                                                {product.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <ImageIcon className="h-4 w-4" />
                                                    <span>{product.images_count} images</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{product.created_at}</span>
                                                </div>
                                            </div>
                                            <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
                                                <ExternalLink className="h-3 w-3" />
                                                <span className="truncate">{product.source_url}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}