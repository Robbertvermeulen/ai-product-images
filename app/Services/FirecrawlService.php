<?php

namespace App\Services;

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
     * Scrape a URL and return structured product data
     */
    public function scrapeUrl(string $url): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer '.$this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(60)->post($this->apiUrl.'/scrape', [
                'url' => $url,
                'formats' => [
                    'markdown',
                    'images',
                    [
                        'type' => 'json',
                        'schema' => $this->getProductSchema(),
                    ],
                ],
                'onlyMainContent' => true,
                'waitFor' => 3000,
            ]);

            if (!$response->successful()) {
                throw new \Exception('Firecrawl API error: '.$response->body());
            }

            $data = $response->json();

            // Get structured product data from Firecrawl's extraction
            $extractedData = $data['data']['json'] ?? [];
            $markdown = $data['data']['markdown'] ?? '';
            $images = $data['data']['images'] ?? [];
            $metadata = $data['data']['metadata'] ?? [];

            return [
                'success' => true,
                'url' => $url,
                'markdown' => $markdown,
                'extract' => [
                    'title' => $extractedData['name'] ?? $metadata['title'] ?? 'Untitled Product',
                    'description' => $extractedData['description'] ?? $metadata['description'] ?? '',
                    'images' => array_merge($extractedData['images'] ?? [], $images),
                    'price' => $extractedData['price'] ?? null,
                    'brand' => $extractedData['brand'] ?? null,
                ],
                'metadata' => $metadata,
                'scraped_at' => now()->toIso8601String(),
            ];
        } catch (\Exception $e) {
            Log::error('Firecrawl scraping failed', [
                'url' => $url,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Extract product data from scraped content
     */
    public function extractProductSchema(array $scrapedData): array
    {
        // If we have structured extraction data, use it
        if (isset($scrapedData['extract']) && !empty($scrapedData['extract'])) {
            return [
                'name' => $scrapedData['extract']['title'] ?? 'Untitled Product',
                'description' => $scrapedData['extract']['description'] ?? '',
                'images' => $scrapedData['extract']['images'] ?? [],
                'price' => $scrapedData['extract']['price'] ?? null,
                'brand' => $scrapedData['extract']['brand'] ?? null,
            ];
        }

        // Fallback to empty data
        return [
            'name' => 'Untitled Product',
            'description' => '',
            'images' => [],
        ];
    }

    /**
     * Get product extraction schema for Firecrawl JSON format
     */
    protected function getProductSchema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'name' => [
                    'type' => 'string',
                    'description' => 'Product name or title',
                ],
                'description' => [
                    'type' => 'string',
                    'description' => 'Product description or details',
                ],
                'price' => [
                    'type' => 'string',
                    'description' => 'Product price including currency',
                ],
                'brand' => [
                    'type' => 'string',
                    'description' => 'Brand or manufacturer name',
                ],
                'images' => [
                    'type' => 'array',
                    'items' => [
                        'type' => 'string',
                        'description' => 'Product image URLs',
                    ],
                    'description' => 'Array of all product image URLs',
                ],
                'availability' => [
                    'type' => 'string',
                    'description' => 'Product availability status',
                ],
            ],
            'required' => ['name'],
        ];
    }
}
