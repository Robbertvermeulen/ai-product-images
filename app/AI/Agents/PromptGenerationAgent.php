<?php

namespace App\AI\Agents;

/**
 * Agent for generating DALL-E prompts from recommendations
 *
 * Takes a recommendation and existing product images to generate
 * optimized DALL-E prompts that maintain visual consistency.
 */
class PromptGenerationAgent extends BaseAgent
{
    /**
     * System prompt that defines prompt generation behavior
     */
    protected string $systemPrompt = 'You are a DALL-E prompt engineer specialized in e-commerce product photography.
You receive: a recommendation for a shot to create, optionally with existing product images for style reference.
You return: a single string that is an optimized DALL-E prompt.
The prompt should be: specific, detailed, mention lighting, composition, background, and maintain consistency with any existing images shown.
Keep prompts under 400 characters for best results.
Focus on photorealistic, professional e-commerce quality.';

    /**
     * Default temperature (model requirement)
     */
    protected float $temperature = 1.0;

    /**
     * Get the agent name
     */
    public function getName(): string
    {
        return 'PromptGenerationAgent';
    }

    /**
     * Generate a DALL-E prompt from a recommendation
     *
     * @param  string  $recommendation  The shot recommendation to implement
     * @param  array  $existingImages  Optional array of existing product image URLs for style reference
     * @param  array  $context  Optional context like ['title' => 'Product Name', 'description' => '...']
     * @return string The DALL-E prompt
     *
     * @throws \Exception When prompt generation fails
     */
    public function generatePrompt(string $recommendation, array $existingImages = [], array $context = []): string
    {
        $prompt = $recommendation;

        $options = ['context' => $context];

        if (!empty($existingImages)) {
            $options['images'] = array_slice($existingImages, 0, 3); // Max 3 for reference
        }

        return $this->execute($prompt, $options);
    }

    /**
     * Refine an existing prompt based on user feedback
     *
     * @param  string  $originalPrompt  The original DALL-E prompt
     * @param  string  $feedback  User's refinement request
     * @return string The refined DALL-E prompt
     *
     * @throws \Exception When refinement fails
     */
    public function refinePrompt(string $originalPrompt, string $feedback): string
    {
        $prompt = "Original prompt: {$originalPrompt}\n\nUser feedback: {$feedback}\n\nCreate an improved prompt.";

        return $this->execute($prompt);
    }
}
