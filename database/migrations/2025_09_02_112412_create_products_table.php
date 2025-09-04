<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('organization_id')->constrained()->onDelete('cascade');
            $table->string('source_url', 2048);
            $table->string('name');
            $table->text('description')->nullable();
            $table->json('original_images');
            $table->json('scraped_data');
            $table->json('product_analysis')->nullable();
            $table->string('status')->default('pending');
            $table->timestamps();

            $table->index('organization_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
