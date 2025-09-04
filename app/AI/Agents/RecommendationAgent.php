<?php

namespace App\AI\Agents;

/**
 * Agent for recommending additional product shots
 *
 * Analyzes existing image descriptions and recommends what additional
 * shots would improve the product listing's conversion potential.
 */
class RecommendationAgent extends BaseAgent
{
    /**
     * System prompt that defines recommendation behavior
     */
    protected string $systemPrompt = "You are an e-commerce conversion expert.
You will analyze product images and recommend additional shots that would improve conversion.
You return: a JSON array of strings, each string is a specific recommendation for an additional product shot that would help convert browsers to buyers.
Focus on: lifestyle shots showing the product in use, detail shots of materials/features, scale comparisons, and hero shots that are missing.
Each recommendation should be one clear, actionable sentence describing what to capture.
Recommend 3-6 shots maximum based on what's missing from the current images.";

    /**
     * Default temperature (model requirement)
     */
    protected float $temperature = 1.0;

    /**
     * Get the agent name
     */
    public function getName(): string
    {
        return 'RecommendationAgent';
    }

    /**
     * Recommend additional product shots based on existing images
     *
     * @param  array  $imageUrls  Array of image URLs to analyze
     * @param  array  $context  Optional context like ['title' => 'Product Name', 'description' => '...']
     * @return array Array of recommendation strings
     *
     * @throws \Exception When recommendation generation fails
     */
    public function recommendShots(array $imageUrls, array $context = []): array
    {
        $prompt = 'Analyze these product images and recommend additional shots that would improve conversion.';

        if (!empty($context)) {
            $prompt .= "\n\nProduct context: ".json_encode($context);
        }

        return $this->execute($prompt, [
            'images' => $imageUrls,
            'json' => true,
        ]);
    }
}
