<?php

use App\Http\Controllers\API\ProductApiController;
use App\Http\Controllers\API\StudioApiController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    // Product management
    Route::post('/products/scrape', [ProductApiController::class, 'scrape']);
    Route::post('/products/{product}/select-images', [ProductApiController::class, 'selectImages']);
    Route::post('/products/{product}/analyze', [ProductApiController::class, 'analyze']);
    Route::get('/products/{product}/recommendations', [ProductApiController::class, 'recommendations']);

    // Studio/generation
    Route::post('/studio/products/{product}/sessions', [StudioApiController::class, 'createSession']);
    Route::post('/studio/sessions/{session}/prompt', [StudioApiController::class, 'generatePrompt']);
    Route::post('/studio/sessions/{session}/generate', [StudioApiController::class, 'generateImage']);
    Route::post('/studio/images/{image}/refine', [StudioApiController::class, 'refinePrompt']);
    Route::get('/studio/sessions/{session}/images', [StudioApiController::class, 'getSessionImages']);
});
