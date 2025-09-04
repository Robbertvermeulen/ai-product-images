<?php

namespace App\AI\Agents;

/**
 * Agent for analyzing and describing product images
 *
 * Takes product images and returns natural language descriptions
 * of what's visible in each image.
 */
class ImageAnalysisAgent extends BaseAgent
{
    /**
     * System prompt that defines image analysis behavior
     */
    protected string $systemPrompt = 'You are a product image analyzer.
You receive: product images and optional context (title, description).
You return: a JSON object where each key is the image filename/url and each value is a natural language description of what you see in that image.
Focus on: shot type (hero, lifestyle, detail, scale, etc.), angle, composition, visible features, and what the image shows.
Be concise but thorough in your descriptions.';

    /**
     * Default temperature (model requirement)
     */
    protected float $temperature = 1.0;

    /**
     * Get the agent name
     */
    public function getName(): string
    {
        return 'ImageAnalysisAgent';
    }

    /**
     * Analyze and describe product images
     *
     * @param  array  $imageUrls  Array of image URLs to analyze
     * @param  array  $context  Optional context like ['title' => 'Product Name', 'description' => '...']
     * @return array JSON object with image URL as key and description as value
     *
     * @throws \Exception When image analysis fails
     */
    public function describeImages(array $imageUrls, array $context = []): array
    {
        if (empty($imageUrls)) {
            return [];
        }

        $prompt = json_encode($context ?: ['no_context' => 'Please analyze based on what you see']);

        return $this->execute($prompt, [
            'images' => $imageUrls,
            'json' => true,
        ]);
    }

    /**
     * Analyze a single product image
     *
     * @param  string  $imageUrl  URL of the image to analyze
     * @param  array  $context  Optional context like ['title' => 'Product Name', 'description' => '...']
     * @return string Natural language description of the image
     *
     * @throws \Exception When image analysis fails
     */
    public function analyzeImage(string $imageUrl, array $context = []): string
    {
        $prompt = 'Analyze this product image and describe what you see in 2-3 sentences. Focus on shot type, composition, and visible features.';

        if (!empty($context)) {
            $prompt .= "\nContext: ".json_encode($context);
        }

        $result = $this->execute($prompt, [
            'images' => [$imageUrl],
            'json' => false,
        ]);

        return is_string($result) ? $result : json_encode($result);
    }
}
