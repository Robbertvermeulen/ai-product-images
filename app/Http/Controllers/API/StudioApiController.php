<?php

namespace App\Http\Controllers\API;

use App\AI\Agents\PromptGenerationAgent;
use App\Http\Controllers\Controller;
use App\Models\GeneratedImage;
use App\Models\Product;
use App\Models\StudioSession;
use App\Services\OpenAIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class StudioApiController extends Controller
{
    /**
     * Start a new studio session for a product
     */
    public function createSession(Request $request, Product $product): JsonResponse
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
        ]);

        // Verify user has access to this product
        $user = auth()->user();
        $userOrganizationIds = $user->organizations()->pluck('organizations.id')->toArray();

        if (!in_array($product->organization_id, $userOrganizationIds)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            $session = StudioSession::create([
                'product_id' => $product->id,
                'user_id' => $user->id,
                'name' => $request->name ?? "Studio Session - {$product->name}",
                'status' => 'active',
            ]);

            return response()->json([
                'session_id' => $session->id,
                'name' => $session->name,
                'status' => $session->status,
                'created_at' => $session->created_at,
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to create studio session', [
                'product_id' => $product->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'Failed to create session',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Generate a DALL-E prompt from a recommendation
     */
    public function generatePrompt(Request $request, StudioSession $session): JsonResponse
    {
        $request->validate([
            'recommendation' => 'required|string',
            'use_style_reference' => 'boolean',
        ]);

        // Verify user owns this session
        if ($session->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            $product = $session->product;

            // Get existing images for style reference if requested
            $existingImages = [];
            if ($request->use_style_reference ?? true) {
                $existingImages = $product->productImages()
                    ->where('is_selected', true)
                    ->limit(3)
                    ->pluck('url')
                    ->toArray();
            }

            // Generate the DALL-E prompt
            $agent = new PromptGenerationAgent;
            $prompt = $agent->generatePrompt(
                $request->recommendation,
                $existingImages,
                [
                    'product_name' => $product->name,
                    'product_description' => substr($product->description, 0, 200),
                ],
            );

            return response()->json([
                'prompt' => $prompt,
                'recommendation' => $request->recommendation,
            ]);

        } catch (\Exception $e) {
            Log::error('Prompt generation failed', [
                'session_id' => $session->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'Failed to generate prompt',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Generate an image using DALL-E
     */
    public function generateImage(Request $request, StudioSession $session): JsonResponse
    {
        $request->validate([
            'prompt' => 'required|string|max:1000',
            'recommendation' => 'nullable|string',
            'size' => 'nullable|string|in:1024x1024,1792x1024,1024x1792',
        ]);

        // Verify user owns this session
        if ($session->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            DB::beginTransaction();

            // Use OpenAI service to generate image
            $openai = new OpenAIService;
            $imageUrl = $openai->generateImage(
                $request->prompt,
                $request->size ?? '1024x1024',
            );

            // Store generated image record
            $generatedImage = GeneratedImage::create([
                'studio_session_id' => $session->id,
                'prompt' => $request->prompt,
                'recommendation' => $request->recommendation,
                'generated_url' => $imageUrl,
                'version' => $session->generatedImages()->count() + 1,
                'metadata' => [
                    'size' => $request->size ?? '1024x1024',
                    'model' => config('openai.models.image'),
                ],
            ]);

            DB::commit();

            return response()->json([
                'image_id' => $generatedImage->id,
                'url' => $generatedImage->generated_url,
                'prompt' => $generatedImage->prompt,
                'version' => $generatedImage->version,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Image generation failed', [
                'session_id' => $session->id,
                'prompt' => $request->prompt,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'Failed to generate image',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Refine a prompt based on user feedback
     */
    public function refinePrompt(Request $request, GeneratedImage $image): JsonResponse
    {
        $request->validate([
            'feedback' => 'required|string',
        ]);

        // Verify user owns this image's session
        if ($image->studioSession->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            $agent = new PromptGenerationAgent;
            $refinedPrompt = $agent->refinePrompt(
                $image->prompt,
                $request->feedback,
            );

            return response()->json([
                'original_prompt' => $image->prompt,
                'refined_prompt' => $refinedPrompt,
                'feedback' => $request->feedback,
            ]);

        } catch (\Exception $e) {
            Log::error('Prompt refinement failed', [
                'image_id' => $image->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'Failed to refine prompt',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all images in a studio session
     */
    public function getSessionImages(StudioSession $session): JsonResponse
    {
        // Verify user owns this session
        if ($session->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $images = $session->generatedImages()
            ->orderBy('version', 'desc')
            ->get()
            ->map(function ($image) {
                return [
                    'id' => $image->id,
                    'url' => $image->generated_url,
                    'prompt' => $image->prompt,
                    'recommendation' => $image->recommendation,
                    'version' => $image->version,
                    'created_at' => $image->created_at,
                ];
            });

        return response()->json([
            'images' => $images,
            'total' => $images->count(),
        ]);
    }
}
