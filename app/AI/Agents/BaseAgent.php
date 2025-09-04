<?php

namespace App\AI\Agents;

use Illuminate\Support\Facades\Log;
use OpenAI\Laravel\Facades\OpenAI;

/**
 * Base agent for all AI operations
 *
 * Provides a single execute method that handles all types of OpenAI API calls.
 * System prompts define agent behavior, no complex parsing needed.
 */
abstract class BaseAgent
{
    /**
     * System prompt that defines this agent's behavior
     */
    protected string $systemPrompt = '';

    /**
     * The OpenAI model to use
     */
    protected string $model;

    /**
     * Temperature for response creativity
     */
    protected float $temperature = 0.7;

    /**
     * Maximum tokens for response
     */
    protected int $maxTokens = 2000;

    /**
     * Initialize the agent
     */
    public function __construct()
    {
        $this->model = config('openai.models.completion', 'gpt-4-vision-preview');
    }

    /**
     * Get the agent's name for logging
     */
    abstract public function getName(): string;

    /**
     * Execute an OpenAI API call
     *
     * @param  string  $prompt  The prompt to send
     * @param  array  $options  Options array with keys:
     *                          - images: array of image URLs to include
     *                          - context: array of additional context
     *                          - json: boolean, whether to request JSON response
     * @return string|array Returns string for text responses, array for JSON responses
     *
     * @throws \Exception When API call fails
     */
    protected function execute(string $prompt, array $options = []): string|array
    {
        try {
            $messages = $this->buildMessages(
                $prompt,
                $options['images'] ?? [],
                $options['context'] ?? [],
            );

            $params = [
                'model' => $this->model,
                'messages' => $messages,
                'temperature' => $this->temperature,
                'max_completion_tokens' => $this->maxTokens,
            ];

            if ($options['json'] ?? false) {
                $params['response_format'] = ['type' => 'json_object'];
            }

            $response = OpenAI::chat()->create($params);
            $content = $response->choices[0]->message->content;

            return ($options['json'] ?? false)
                ? json_decode($content, true)
                : $content;
        } catch (\Exception $e) {
            Log::error("AI Agent {$this->getName()} failed", [
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Build messages array for OpenAI API
     *
     * @param  string  $prompt  The user prompt
     * @param  array  $images  Image URLs to include
     * @param  array  $context  Additional context
     * @return array Messages formatted for OpenAI API
     */
    private function buildMessages(string $prompt, array $images = [], array $context = []): array
    {
        $fullPrompt = $this->buildFullPrompt($prompt, $context);

        if (empty($images)) {
            return [
                ['role' => 'system', 'content' => $this->systemPrompt],
                ['role' => 'user', 'content' => $fullPrompt],
            ];
        }

        return [
            ['role' => 'system', 'content' => $this->systemPrompt],
            ['role' => 'user', 'content' => $this->buildContentWithImages($fullPrompt, $images)],
        ];
    }

    /**
     * Build prompt with context
     *
     * @param  string  $prompt  The base prompt
     * @param  array  $context  Context to append
     * @return string Combined prompt
     */
    private function buildFullPrompt(string $prompt, array $context): string
    {
        if (empty($context)) {
            return $prompt;
        }

        return $prompt."\n\nAdditional context: ".json_encode($context);
    }

    /**
     * Build content array with images
     *
     * @param  string  $prompt  The text prompt
     * @param  array  $images  Image URLs
     * @return array Content array for vision API
     */
    private function buildContentWithImages(string $prompt, array $images): array
    {
        $content = [
            ['type' => 'text', 'text' => $prompt],
        ];

        foreach ($images as $url) {
            $content[] = [
                'type' => 'image_url',
                'image_url' => ['url' => $url],
            ];
        }

        return $content;
    }

    /**
     * Set temperature for this agent
     *
     * @param  float  $temperature  Temperature value
     */
    public function setTemperature(float $temperature): self
    {
        $this->temperature = $temperature;

        return $this;
    }

    /**
     * Set max tokens for this agent
     *
     * @param  int  $maxTokens  Maximum tokens
     */
    public function setMaxTokens(int $maxTokens): self
    {
        $this->maxTokens = $maxTokens;

        return $this;
    }
}
