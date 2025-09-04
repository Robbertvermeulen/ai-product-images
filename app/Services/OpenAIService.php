<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use OpenAI\Laravel\Facades\OpenAI;

/**
 * Service for OpenAI API operations
 *
 * Handles image generation and other OpenAI API interactions
 * that don't fit into specific agent patterns.
 */
class OpenAIService
{
    /**
     * Generate an image using DALL-E
     *
     * @param  string  $prompt  The prompt for image generation
     * @param  string  $size  The size of the image (1024x1024, 1792x1024, 1024x1792)
     * @param  string  $quality  The quality of the image (standard or hd)
     * @return string The URL of the generated image
     *
     * @throws \Exception When image generation fails
     */
    public function generateImage(string $prompt, string $size = '1024x1024', string $quality = 'standard'): string
    {
        try {
            Log::info('Generating image with OpenAI', [
                'prompt_length' => strlen($prompt),
                'size' => $size,
                'quality' => $quality,
            ]);

            $response = OpenAI::images()->create([
                'model' => config('openai.models.image', 'dall-e-3'),
                'prompt' => $prompt,
                'size' => $size,
                'quality' => $quality,
                'n' => 1,
            ]);

            if (!isset($response->data[0]->url)) {
                throw new \Exception('No image URL in response');
            }

            $imageUrl = $response->data[0]->url;

            Log::info('Image generated successfully', [
                'url' => substr($imageUrl, 0, 100).'...',
            ]);

            return $imageUrl;

        } catch (\Exception $e) {
            Log::error('Image generation failed', [
                'error' => $e->getMessage(),
                'prompt' => substr($prompt, 0, 200),
            ]);
            throw $e;
        }
    }

    /**
     * Generate multiple variations of an image
     *
     * @param  string  $prompt  The base prompt
     * @param  int  $count  Number of variations to generate
     * @param  string  $size  The size of the images
     * @return array Array of image URLs
     *
     * @throws \Exception When generation fails
     */
    public function generateImageVariations(string $prompt, int $count = 3, string $size = '1024x1024'): array
    {
        $images = [];

        for ($i = 0; $i < $count; $i++) {
            try {
                $imageUrl = $this->generateImage($prompt, $size);
                $images[] = $imageUrl;

                // Small delay to avoid rate limits
                if ($i < $count - 1) {
                    usleep(500000); // 0.5 seconds
                }
            } catch (\Exception $e) {
                Log::warning('Failed to generate variation', [
                    'iteration' => $i + 1,
                    'error' => $e->getMessage(),
                ]);
                // Continue trying other variations
            }
        }

        if (empty($images)) {
            throw new \Exception('Failed to generate any image variations');
        }

        return $images;
    }
}
