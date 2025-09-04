<?php

namespace App\Http\Controllers;

use App\Models\StudioSession;
use Inertia\Inertia;
use Inertia\Response;

class StudioController extends Controller
{
    /**
     * Display a studio session
     */
    public function session(StudioSession $session): Response
    {
        // Verify user owns this session
        if ($session->user_id !== auth()->id()) {
            abort(403);
        }

        $session->load(['product.productImages', 'generatedImages']);

        return Inertia::render('Studio/Session', [
            'session' => [
                'id' => $session->id,
                'name' => $session->name,
                'status' => $session->status,
                'product_id' => $session->product_id,
                'generated_images' => $session->generatedImages->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'url' => $image->generated_url,
                        'prompt' => $image->prompt,
                        'recommendation' => $image->recommendation,
                        'version' => $image->version,
                        'created_at' => $image->created_at->toISOString(),
                    ];
                }),
            ],
        ]);
    }
}
