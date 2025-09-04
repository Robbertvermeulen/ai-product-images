<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of products
     */
    public function index(): Response
    {
        $products = auth()->user()
            ->organizations()
            ->first()
            ->products()
            ->with('productImages')
            ->latest()
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => substr($product->description, 0, 150).'...',
                    'source_url' => $product->source_url,
                    'status' => $product->status,
                    'thumbnail' => $product->productImages->first()?->url,
                    'images_count' => $product->productImages->count(),
                    'created_at' => $product->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('Products/Index', [
            'products' => $products,
        ]);
    }

    /**
     * Show the form for creating a new product
     */
    public function create(): Response
    {
        return Inertia::render('Products/Create');
    }

    /**
     * Display the specified product
     */
    public function show(Product $product): Response
    {
        // Verify user has access
        $userOrganizationIds = auth()->user()->organizations()->pluck('organizations.id')->toArray();
        if (!in_array($product->organization_id, $userOrganizationIds)) {
            abort(403);
        }

        $product->load('productImages');

        return Inertia::render('Products/Show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'source_url' => $product->source_url,
                'status' => $product->status,
                'product_images' => $product->productImages->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'url' => $image->url,
                        'analysis' => $image->analysis,
                        'is_selected' => $image->is_selected,
                        'order' => $image->order,
                    ];
                }),
            ],
        ]);
    }
}
