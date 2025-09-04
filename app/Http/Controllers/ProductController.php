<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StudioSession;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of products for the authenticated user
     */
    public function index(): Response
    {
        $products = Product::query()
            ->whereHas('organization.users', function ($query) {
                $query->where('user_id', auth()->id());
            })
            ->withCount(['studioSessions', 'generatedImages'])
            ->with(['studioSessions' => function ($query) {
                $query->latest()->limit(1);
            }])
            ->latest()
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'source_url' => $product->source_url,
                    'thumbnail' => $product->original_images[0] ?? null,
                    'images_count' => count($product->original_images ?? []),
                    'generated_images_count' => $product->generated_images_count,
                    'studio_sessions_count' => $product->studio_sessions_count,
                    'last_session_at' => $product->studioSessions->first()?->updated_at?->format('Y-m-d H:i'),
                    'has_active_session' => $product->studioSessions->first()?->isActive() ?? false,
                    'created_at' => $product->created_at->format('Y-m-d H:i'),
                ];
            });

        return Inertia::render('Products', [
            'products' => $products,
        ]);
    }

    /**
     * Load a product with its active session or create a new session
     */
    public function studio(Product $product): Response
    {
        // Check if user has access to this product
        if (!$product->organization->users()->where('user_id', auth()->id())->exists()) {
            abort(403);
        }

        // Get or create active session
        $session = $product->studioSessions()
            ->where('user_id', auth()->id())
            ->where('status', 'active')
            ->first();

        if (!$session) {
            $session = $product->studioSessions()->create([
                'user_id' => auth()->id(),
                'status' => 'active',
                'session_data' => [],
            ]);
        }

        // Load generated images for this product (all sessions)
        $generatedImages = $product->generatedImages()
            ->latest()
            ->get()
            ->map(function ($image) {
                return [
                    'id' => $image->id,
                    'url' => $image->image_url,
                    'prompt' => $image->prompt,
                    'type' => $image->parameters['type'] ?? 'Generated',
                    'timestamp' => $image->created_at,
                ];
            });

        return Inertia::render('Dashboard', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'source_url' => $product->source_url,
                'images' => $product->original_images,
                'analysis' => $product->product_analysis,
            ],
            'session' => [
                'id' => $session->id,
                'data' => $session->session_data,
                'status' => $session->status,
            ],
            'generatedImages' => $generatedImages,
        ]);
    }

    /**
     * Save session data
     */
    public function saveSession(Request $request, Product $product, StudioSession $session)
    {
        // Verify access
        if ($session->user_id !== auth()->id() || $session->product_id !== $product->id) {
            abort(403);
        }

        $validated = $request->validate([
            'session_data' => 'required|array',
        ]);

        $session->update([
            'session_data' => $validated['session_data'],
        ]);

        return response()->json(['message' => 'Session saved']);
    }

    /**
     * Check if a product exists for the given URL
     */
    public function checkUrl(Request $request)
    {
        $validated = $request->validate([
            'url' => 'required|url',
        ]);

        $product = Product::query()
            ->whereHas('organization.users', function ($query) {
                $query->where('user_id', auth()->id());
            })
            ->where('source_url', $validated['url'])
            ->first();

        if ($product) {
            return response()->json([
                'exists' => true,
                'product' => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'has_active_session' => $product->studioSessions()
                        ->where('user_id', auth()->id())
                        ->where('status', 'active')
                        ->exists(),
                ],
            ]);
        }

        return response()->json(['exists' => false]);
    }
}
