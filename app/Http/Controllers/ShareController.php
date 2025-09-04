<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ShareLink;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use ZipArchive;

class ShareController extends Controller
{
    /**
     * Show the public showcase page for a shared product
     *
     * @param  string  $shortCode  The unique short code for the share link
     */
    public function show(string $shortCode): Response
    {
        // For now, return the static showcase page
        // Later we'll fetch real data based on the shortCode

        return Inertia::render('Showcase/Show', [
            'shortCode' => $shortCode,
        ]);
    }

    /**
     * Create a new share link for a product
     */
    public function create(Request $request, Product $product): JsonResponse
    {
        // Check if user has access to this product
        if ($product->organization_id !== Auth::user()->organization_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Check if there's an existing active share link for this product
        $existingShareLink = ShareLink::where('product_id', $product->id)
            ->where('is_active', true)
            ->first();

        if ($existingShareLink) {
            return response()->json([
                'share_url' => route('share.show', ['shortCode' => $existingShareLink->short_code]),
                'short_code' => $existingShareLink->short_code,
            ]);
        }

        // Create new share link
        $shareLink = ShareLink::create([
            'product_id' => $product->id,
            'created_by' => Auth::id(),
            'expires_at' => $request->expires_at ?? now()->addDays(30),
            'metadata' => [
                'product_title' => $product->name,
                'product_description' => $product->description,
                'created_from' => 'studio',
            ],
        ]);

        return response()->json([
            'share_url' => route('share.show', ['shortCode' => $shareLink->short_code]),
            'short_code' => $shareLink->short_code,
        ]);
    }

    /**
     * Download all generated images for a shared product
     *
     * @return \Illuminate\Http\Response
     */
    public function download(string $shortCode)
    {
        $shareLink = ShareLink::where('short_code', $shortCode)
            ->where('is_active', true)
            ->firstOrFail();

        // Check if share link is still valid
        if (!$shareLink->isValid()) {
            abort(404, 'This share link has expired');
        }

        // Increment view count
        $shareLink->incrementViews();

        $product = $shareLink->product;
        $generatedImages = $product->generatedImages;

        if ($generatedImages->isEmpty()) {
            return response()->json(['error' => 'No images to download'], 404);
        }

        // Create a temporary zip file
        $zipFileName = 'product-images-'.$product->id.'.zip';
        $zipPath = storage_path('app/temp/'.$zipFileName);

        // Ensure temp directory exists
        if (!file_exists(storage_path('app/temp'))) {
            mkdir(storage_path('app/temp'), 0755, true);
        }

        $zip = new ZipArchive;
        if ($zip->open($zipPath, ZipArchive::CREATE) === true) {
            foreach ($generatedImages as $index => $image) {
                // Add each image to the zip
                // This assumes images are stored locally, adjust as needed
                $imagePath = Storage::path($image->file_path);
                if (file_exists($imagePath)) {
                    $zip->addFile($imagePath, 'image-'.($index + 1).'.png');
                }
            }
            $zip->close();
        }

        // Return the zip file as a download
        return response()->download($zipPath, $zipFileName)->deleteFileAfterSend(true);
    }
}
