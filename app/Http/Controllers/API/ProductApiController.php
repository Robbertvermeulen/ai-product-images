<?php

namespace App\Http\Controllers\API;

use App\AI\Agents\ImageAnalysisAgent;
use App\AI\Agents\RecommendationAgent;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Services\FirecrawlService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductApiController extends Controller
{
    /**
     * Scrape a product URL and create product with images
     */
    public function scrape(Request $request): JsonResponse
    {
        $request->validate([
            'url' => 'required|url',
        ]);

        try {
            DB::beginTransaction();

            // Scrape the URL
            $firecrawl = new FirecrawlService;
            $scrapedData = $firecrawl->scrapeUrl($request->url);

            if (!$scrapedData['success']) {
                return response()->json([
                    'error' => 'Failed to scrape URL',
                    'message' => $scrapedData['error'] ?? 'Unknown error',
                ], 422);
            }

            // Extract product data
            $productData = $firecrawl->extractProductSchema($scrapedData);

            // Get user's organization
            $user = auth()->user();
            $organization = $user->organizations()->first();

            if (!$organization) {
                return response()->json([
                    'error' => 'No organization found for user',
                ], 422);
            }

            // Create product
            $product = Product::create([
                'organization_id' => $organization->id,
                'source_url' => $request->url,
                'name' => $productData['name'] ?? 'Untitled Product',
                'description' => $productData['description'] ?? '',
                'original_images' => $productData['images'] ?? [],
                'scraped_data' => $scrapedData,
                'status' => 'scraped',
            ]);

            // Create ProductImage records for each image
            $productImages = [];
            foreach ($productData['images'] ?? [] as $index => $imageUrl) {
                $productImage = ProductImage::create([
                    'product_id' => $product->id,
                    'url' => $imageUrl,
                    'order' => $index,
                ]);
                $productImages[] = [
                    'id' => $productImage->id,
                    'url' => $productImage->url,
                ];
            }

            DB::commit();

            return response()->json([
                'product_id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'source_url' => $product->source_url,
                'images' => $productImages,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Product scraping failed', [
                'url' => $request->url,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'Failed to process product',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Select images for analysis
     */
    public function selectImages(Request $request, Product $product): JsonResponse
    {
        $request->validate([
            'image_ids' => 'required|array',
            'image_ids.*' => 'uuid',
        ]);

        // Verify user has access to this product
        $user = auth()->user();
        $userOrganizationIds = $user->organizations()->pluck('organizations.id')->toArray();

        if (!in_array($product->organization_id, $userOrganizationIds)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Reset all images to not selected
        $product->productImages()->update(['is_selected' => false]);

        // Mark selected images
        $product->productImages()
            ->whereIn('id', $request->image_ids)
            ->update(['is_selected' => true]);

        return response()->json([
            'success' => true,
            'selected_count' => count($request->image_ids),
        ]);
    }

    /**
     * Analyze selected product images
     */
    public function analyze(Product $product): JsonResponse
    {
        // Verify user has access to this product
        $user = auth()->user();
        $userOrganizationIds = $user->organizations()->pluck('organizations.id')->toArray();

        if (!in_array($product->organization_id, $userOrganizationIds)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $selectedImages = $product->productImages()
            ->where('is_selected', true)
            ->get();

        if ($selectedImages->isEmpty()) {
            return response()->json([
                'error' => 'No images selected for analysis',
            ], 422);
        }

        try {
            $agent = new ImageAnalysisAgent;
            $analyses = [];

            foreach ($selectedImages as $image) {
                $analysis = $agent->analyzeImage($image->url);

                // Store analysis in the image record
                $image->update(['analysis' => $analysis]);

                $analyses[] = [
                    'image_id' => $image->id,
                    'analysis' => $analysis,
                ];
            }

            // Update product status
            $product->update(['status' => 'analyzed']);

            return response()->json([
                'analyses' => $analyses,
            ]);

        } catch (\Exception $e) {
            Log::error('Image analysis failed', [
                'product_id' => $product->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'Analysis failed',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get AI recommendations for missing shots
     */
    public function recommendations(Product $product): JsonResponse
    {
        // Verify user has access to this product
        $user = auth()->user();
        $userOrganizationIds = $user->organizations()->pluck('organizations.id')->toArray();

        if (!in_array($product->organization_id, $userOrganizationIds)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $selectedImages = $product->productImages()
            ->where('is_selected', true)
            ->pluck('url')
            ->toArray();

        if (empty($selectedImages)) {
            return response()->json([
                'error' => 'No images selected',
            ], 422);
        }

        try {
            $agent = new RecommendationAgent;
            $recommendations = $agent->recommendShots(
                $selectedImages,
                [
                    'title' => $product->name,
                    'description' => $product->description,
                ],
            );

            return response()->json([
                'recommendations' => $recommendations,
            ]);

        } catch (\Exception $e) {
            Log::error('Recommendation generation failed', [
                'product_id' => $product->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'Failed to generate recommendations',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
