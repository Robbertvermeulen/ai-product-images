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
        Schema::create('generated_images', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('session_id')->constrained('studio_sessions')->onDelete('cascade');
            $table->foreignUuid('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('preset_type');
            $table->text('prompt');
            $table->text('negative_prompt')->nullable();
            $table->json('chat_history')->nullable();
            $table->string('image_url')->nullable();
            $table->string('storage_path')->nullable();
            $table->json('generation_params');
            $table->json('metadata')->nullable();
            $table->string('status')->default('pending');
            $table->integer('generation_time_ms')->nullable();
            $table->decimal('cost', 8, 4)->nullable();
            $table->timestamps();

            $table->index('session_id');
            $table->index('product_id');
            $table->index('user_id');
            $table->index('status');
            $table->index('preset_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('generated_images');
    }
};
