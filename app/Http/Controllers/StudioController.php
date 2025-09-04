<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class StudioController extends Controller
{
    /**
     * Display the studio dashboard
     */
    public function index(): Response
    {
        return Inertia::render('Studio/Index', [
            'products' => $this->getMockProducts(),
        ]);
    }

    /**
     * Display a specific product's studio
     */
    public function show(string $id): Response
    {
        return Inertia::render('Studio/Show', [
            'product' => $this->getMockProduct($id),
            'recommendations' => $this->getMockRecommendations(),
        ]);
    }

    /**
     * Display the gallery of generated images
     */
    public function gallery(): Response
    {
        return Inertia::render('Studio/Gallery', [
            'images' => $this->getMockGeneratedImages(),
        ]);
    }

    /**
     * Get mock products for development
     */
    private function getMockProducts(): array
    {
        return [
            [
                'id' => '1',
                'name' => 'Ergonomic Office Chair',
                'description' => 'Comfortable office chair with lumbar support',
                'images' => [
                    'https://via.placeholder.com/400x400/4F46E5/ffffff?text=Chair+Front',
                    'https://via.placeholder.com/400x400/7C3AED/ffffff?text=Chair+Side',
                ],
                'status' => 'ready',
            ],
            [
                'id' => '2',
                'name' => 'Wireless Headphones',
                'description' => 'Premium noise-cancelling headphones',
                'images' => [
                    'https://via.placeholder.com/400x400/10B981/ffffff?text=Headphones',
                ],
                'status' => 'analyzing',
            ],
        ];
    }

    /**
     * Get mock product by ID
     */
    private function getMockProduct(string $id): array
    {
        return [
            'id' => $id,
            'name' => 'Ergonomic Office Chair',
            'description' => 'Comfortable office chair with lumbar support and adjustable height',
            'images' => [
                'https://via.placeholder.com/600x600/4F46E5/ffffff?text=Chair+Front',
                'https://via.placeholder.com/600x600/7C3AED/ffffff?text=Chair+Side',
                'https://via.placeholder.com/600x600/EC4899/ffffff?text=Chair+Detail',
            ],
            'image_descriptions' => [
                'Front view showing the full chair with armrests and wheels',
                'Side angle highlighting the ergonomic backrest design',
                'Close-up detail of the adjustment mechanisms',
            ],
            'status' => 'ready',
        ];
    }

    /**
     * Get mock recommendations
     */
    private function getMockRecommendations(): array
    {
        return [
            'Lifestyle shot showing someone working comfortably in the chair at a modern desk',
            'Scale comparison next to a standard office desk to show size',
            'Detail shot of the premium fabric texture and stitching',
            'Hero shot on a gradient background with dramatic lighting',
            'Multiple angle view showing 360-degree rotation',
        ];
    }

    /**
     * Get mock generated images
     */
    private function getMockGeneratedImages(): array
    {
        return [
            [
                'id' => '1',
                'url' => 'https://via.placeholder.com/800x800/3B82F6/ffffff?text=Generated+1',
                'prompt' => 'Professional lifestyle photograph of person working in ergonomic chair',
                'product_name' => 'Ergonomic Office Chair',
                'created_at' => now()->subHours(2)->toDateTimeString(),
            ],
            [
                'id' => '2',
                'url' => 'https://via.placeholder.com/800x800/8B5CF6/ffffff?text=Generated+2',
                'prompt' => 'Close-up detail shot of chair fabric with dramatic lighting',
                'product_name' => 'Ergonomic Office Chair',
                'created_at' => now()->subHours(5)->toDateTimeString(),
            ],
        ];
    }
}
