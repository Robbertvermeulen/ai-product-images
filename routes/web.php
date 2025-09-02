<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StudioController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Product routes
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/{product}/studio', [ProductController::class, 'studio'])->name('products.studio');
    Route::post('/products/{product}/sessions/{session}/save', [ProductController::class, 'saveSession'])->name('products.session.save');
    Route::post('/products/check-url', [ProductController::class, 'checkUrl'])->name('products.check-url');
    
    // Studio routes (legacy - will phase out)
    Route::get('/studio', [StudioController::class, 'index'])->name('studio.index');
    Route::get('/studio/products/{id}', [StudioController::class, 'show'])->name('studio.show');
    Route::get('/studio/gallery', [StudioController::class, 'gallery'])->name('studio.gallery');
});

require __DIR__.'/auth.php';
