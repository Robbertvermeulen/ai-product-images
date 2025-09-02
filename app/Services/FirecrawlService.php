<?php

namespace App\Services;

use App\DTO\ScrapedProductData;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FirecrawlService
{
    protected string $apiKey;

    protected string $apiUrl;

    public function __construct()
    {
        $this->apiKey = config('services.firecrawl.api_key');
        $this->apiUrl = config('services.firecrawl.api_url', 'https://api.firecrawl.dev/v2');
    }

    /**
     * Scrape a URL and return raw data for AI agents to process
     */
    public function scrapeUrl(string $url): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer '.$this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(60)->post($this->apiUrl.'/scrape', [
                'url' => $url,
                'formats' => ['markdown', 'extract'],
                'waitFor' => 3000,
                'screenshot' => true,
                'onlyMainContent' => true,
                'extract' => $this->getProductSchema(),
            ]);

            if (!$response->successful()) {
                throw new \Exception('Firecrawl API error: '.$response->body());
            }

            $data = $response->json();

            return [
                'url' => $url,
                'markdown' => $data['data']['markdown'] ?? '',
                'extract' => $data['data']['extract'] ?? [],
                'metadata' => $data['data']['metadata'] ?? [],
                'scraped_at' => now()->toIso8601String(),
            ];
        } catch (\Exception $e) {
            Log::error('Firecrawl scraping failed', [
                'url' => $url,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Get basic product extraction schema for Firecrawl
     */
    protected function getProductSchema(): array
    {
        return [
            'schema' => [
                'type' => 'object',
                'properties' => [
                    'title' => [
                        'type' => 'string',
                        'description' => 'Product name or title',
                    ],
                    'description' => [
                        'type' => 'string',
                        'description' => 'Product description',
                    ],
                    'images' => [
                        'type' => 'array',
                        'items' => [
                            'type' => 'string',
                        ],
                        'description' => 'Array of product image URLs',
                    ],
                ],
                'required' => ['title', 'images'],
            ],
        ];
    }
}
