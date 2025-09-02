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
     *
     * @var string
     */
    protected string $systemPrompt = "You are an e-commerce conversion expert.
You receive: a JSON object with image descriptions and optional product context.
You return: a JSON array of strings, each string is a specific recommendation for an additional product shot that would help convert browsers to buyers.
Focus on: lifestyle shots, detail shots, scale comparisons, and hero shots that are missing.
Each recommendation should be one clear, actionable sentence describing what to capture.
Recommend 3-6 shots maximum.";

    /**
     * Moderate temperature for creative but relevant suggestions
     *
     * @var float
     */
    protected float $temperature = 0.6;

    /**
     * Get the agent name
     *
     * @return string
     */
    public function getName(): string
    {
        return 'RecommendationAgent';
    }

    /**
     * Recommend additional product shots based on existing images
     *
     * @param array $imageDescriptions Array of image URL => description from ImageAnalysisAgent
     * @param array $context Optional context like ['title' => 'Product Name', 'description' => '...']
     * @return array Array of recommendation strings
     * @throws \Exception When recommendation generation fails
     */
    public function recommendShots(array $imageDescriptions, array $context = []): array
    {
        $prompt = json_encode([
            'existing_images' => $imageDescriptions,
            'product_context' => $context
        ]);

        return $this->execute($prompt, ['json' => true]);
    }
}