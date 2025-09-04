import { FormEventHandler, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Loader2, Link, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function CreateProduct({ auth }: { auth: any }) {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState<any>(null);

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(null);

        try {
            const response = await axios.post('/api/products/scrape', { url });
            setSuccess(response.data);
            
            // Redirect to product detail page after 2 seconds
            setTimeout(() => {
                window.location.href = `/products/${response.data.product_id}`;
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to scrape product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Add New Product</h2>}
        >
            <Head title="Add Product" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Import Product from URL</CardTitle>
                            <CardDescription>
                                Enter a product URL from any e-commerce site to import images and details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Input
                                            type="url"
                                            placeholder="https://example.com/product-page"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            required
                                            disabled={loading}
                                            className="w-full"
                                        />
                                    </div>
                                    <Button type="submit" disabled={loading || !url}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Scraping...
                                            </>
                                        ) : (
                                            <>
                                                <Link className="mr-2 h-4 w-4" />
                                                Import Product
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>

                            {error && (
                                <Alert variant="destructive" className="mt-4">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {success && (
                                <Alert className="mt-4 border-green-200 bg-green-50">
                                    <AlertDescription className="text-green-800">
                                        <strong>Success!</strong> Product imported successfully.
                                        <br />
                                        Found {success.images?.length || 0} images.
                                        <br />
                                        Redirecting to product page...
                                    </AlertDescription>
                                </Alert>
                            )}

                            {loading && (
                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Connecting to website...</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Extracting product information...</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Downloading images...</span>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Supported Sites</CardTitle>
                            <CardDescription>
                                Our AI can extract product data from most e-commerce websites
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div>✓ Shopify stores</div>
                                <div>✓ WooCommerce</div>
                                <div>✓ Amazon</div>
                                <div>✓ Custom websites</div>
                                <div>✓ Magento</div>
                                <div>✓ And many more...</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}