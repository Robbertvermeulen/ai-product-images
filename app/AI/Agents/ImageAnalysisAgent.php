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
     *
     * @var string
     */
    protected string $systemPrompt = "You are a product image analyzer.
You receive: product images and optional context (title, description).
You return: a JSON object where each key is the image filename/url and each value is a natural language description of what you see in that image.
Focus on: shot type (hero, lifestyle, detail, scale, etc.), angle, composition, visible features, and what the image shows.
Be concise but thorough in your descriptions.";

    /**
     * Lower temperature for consistent analysis
     *
     * @var float
     */
    protected float $temperature = 0.3;

    /**
     * Get the agent name
     *
     * @return string
     */
    public function getName(): string
    {
        return 'ImageAnalysisAgent';
    }

    /**
     * Analyze and describe product images
     *
     * @param array $imageUrls Array of image URLs to analyze
     * @param array $context Optional context like ['title' => 'Product Name', 'description' => '...']
     * @return array JSON object with image URL as key and description as value
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
            'json' => true
        ]);
    }
}