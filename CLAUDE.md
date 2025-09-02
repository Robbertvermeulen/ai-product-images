# ProductImageAI.com - AI-Powered E-commerce Image Generator

## 🎯 Project Overview
**Purpose:** Generate missing e-commerce product imagery using AI to increase conversion rates  
**Problem:** E-commerce listings with missing lifestyle, detail, or scale shots lose 40% of potential sales  
**Solution:** AI-powered image generation that creates the missing shots from existing product photos

**Core Value Proposition:**
- **Headline:** "Stop Losing Sales Due to Missing Product Imagery"
- **Subline:** "Generate the missing lifestyle, detail, and scale shots that convert browsers into buyers"

📖 **See [VALUE_PROPOSITION.md](VALUE_PROPOSITION.md) for complete business context and vision**

## 🏗️ Architecture & Tech Stack

### Core Technologies
- **Framework:** Laravel 12.26.4 (latest features)
- **Frontend:** Inertia.js + React + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Database:** PostgreSQL with UUID-based multi-tenancy
- **AI Models:** 
  - GPT-5 for completions and vision (`AI_COMPLETION_MODEL`, `AI_VISION_MODEL`)
  - gpt-image-1 for image generation (`AI_IMAGE_MODEL`)
- **Image Generation:** via OpenAI API (configurable model)
- **Web Scraping:** Firecrawl API v2
- **Queue System:** Laravel Jobs (sync for MVP, Redis-ready)

### Development Tools
- **Laravel Boost:** AI-enhanced development assistance
- **Laravel Pint:** Code style enforcement (PSR-12 + Laravel conventions)
- **PHPUnit:** Testing framework
- **TypeScript:** Type-safe frontend development

## 🤖 AI Agent Architecture

**CRITICAL: All AI operations use specialized agents, NOT direct API calls**

### Agent System Design (Simplified MVP)
```
BaseAgent (Abstract)
├── ImageAnalysisAgent        - Describes what's in existing images
├── RecommendationAgent       - Recommends additional shots to create
└── PromptGenerationAgent     - Generates DALL-E prompts from recommendations
```

### Key Principles
1. **Natural Language Output** - Agents return text/arrays, not forced JSON structures
2. **Optional Context** - All agents work with or without product title/description
3. **Small Methods** - Each method < 20 lines, single responsibility
4. **Flexible Input** - Supports both URL scraping and direct image upload scenarios

## 📝 Development Standards

### Code Style Requirements
**MANDATORY: Use docblocks for all classes, methods, and complex logic**

```php
/**
 * Extract product data from scraped website content
 * 
 * @param array $scrapedData Raw data from Firecrawl
 * @return array Structured product information
 * @throws \Exception When extraction fails
 */
public function extractProductData(array $scrapedData): array
```

### Laravel Best Practices
- **Eloquent ORM** for ALL database operations (no raw SQL)
- **Form Requests** for validation (never validate in controllers)
- **Policies** for authorization logic
- **Resources** for API responses
- **Jobs** for background processing
- **Events/Listeners** for decoupled architecture
- **Service Providers** for dependency injection

### Laravel Pint Commands
```bash
# Before EVERY commit
./vendor/bin/pint

# Check without fixing
./vendor/bin/pint --test

# Fix specific directory
./vendor/bin/pint app/AI/Agents/

# With verbose output
./vendor/bin/pint -v
```

## 🗄️ Database Architecture

### Models with UUID Primary Keys
- `Organization` - Multi-tenant organizations
- `Product` - Scraped product data
- `StudioSession` - User image generation sessions
- `GeneratedImage` - AI-generated images
- `ShareLink` - Public sharing URLs
- `UsageLog` - Tracking and billing

### Key Relationships
- Organizations have many Products
- Products have many StudioSessions
- StudioSessions have many GeneratedImages
- Users belong to Organizations (many-to-many)

## 🔄 Processing Pipeline

### 1. Product Input Flow (Two Paths)
```
Path A: URL Scraping
User submits URL → FirecrawlService
                   └── Returns: title, description, images[]

Path B: Direct Upload
User uploads images → Returns: images[] only
```

### 2. Analysis & Recommendation Flow
```
Images[] → ImageAnalysisAgent (describe each image)
           └── RecommendationAgent (suggest missing shots)
               └── Returns array of recommendations
```

### 3. Image Generation Flow
```
User selects recommendation → PromptGenerationAgent
                              ├── Uses existing images for style reference
                              ├── Uses recommendation text
                              └── Generates DALL-E prompt
```

### 4. Refinement Flow
```
User provides feedback → PromptGenerationAgent.refinePrompt()
                        └── Returns improved DALL-E prompt
```

## 🎨 Image Generation Presets

### Smart Presets (Bakje System)
1. **Lifestyle** - Product in use, aspirational context
2. **Detail** - Close-up macro shots, texture focus
3. **Scale** - Size comparison with reference objects
4. **Hero** - Premium positioning, main listing image

Each preset uses the `ImageGenerationAgent` to create optimized prompts based on product analysis.

## 🚀 Current Development Status

### ✅ Completed
- Laravel 12 installation with Breeze auth
- Database models and migrations
- AI Agent system architecture
- Background job infrastructure
- Firecrawl integration (scraping only)
- OpenAI service with agent integration
- Laravel Boost configuration

### 🔄 In Progress
- API Controllers and routes
- Studio interface (React components)
- Image storage system

### 📋 Next Steps
1. Run migrations and seed database
2. Build API endpoints
3. Create Studio UI components
4. Implement real-time updates
5. Add image storage to S3

## 🔐 Security & Privacy

### Data Protection
- UUID-based multi-tenancy
- Organization-level data isolation
- Secure API key storage in .env
- Laravel Sanctum for API authentication

### Usage Tracking
- All API calls logged in UsageLog
- Organization-level usage limits
- Cost tracking per operation

## 🧪 Testing Strategy

### Test Coverage Requirements
- Unit tests for all Agents
- Feature tests for API endpoints
- Integration tests for job processing
- Browser tests for critical user flows

### Running Tests
```bash
# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature

# With coverage
php artisan test --coverage
```

## 📚 Key Files Reference

### Configuration
- `config/openai.php` - OpenAI settings including model
- `config/services.php` - Firecrawl API configuration
- `pint.json` - Laravel Pint rules

### AI Agents
- `app/AI/Agents/BaseAgent.php` - Simple OpenAI wrapper
- `app/AI/Agents/ImageAnalysisAgent.php` - Describes existing images
- `app/AI/Agents/RecommendationAgent.php` - Suggests missing shots
- `app/AI/Agents/PromptGenerationAgent.php` - Creates DALL-E prompts

### Services
- `app/Services/FirecrawlService.php` - Web scraping ONLY
- `app/Services/OpenAIService.php` - AI operations coordinator

### Jobs
- `app/Jobs/ScrapeProductUrl.php` - Product scraping pipeline
- `app/Jobs/AnalyzeProduct.php` - Product analysis pipeline
- `app/Jobs/GenerateProductImage.php` - Image generation pipeline
- `app/Jobs/ProcessImageGeneration.php` - Refinement pipeline

## 💡 Important Decisions

1. **AI Model Strategy** - GPT-5 for completions/vision, gpt-image-1 for image generation
2. **Agent-Based Architecture** - Specialized agents instead of monolithic services
3. **UUID Multi-Tenancy** - Better for distributed systems and data portability
4. **Bakje System** - Individual image generation, not bulk queues
5. **Laravel Native Features** - Leverage framework instead of custom solutions
6. **Docblocks Everywhere** - Self-documenting code for maintainability

## 🚨 Critical Rules

1. **NEVER put extraction logic in FirecrawlService**
2. **ALWAYS use AI Agents for AI operations**
3. **ALWAYS run Laravel Pint before commits**
4. **ALWAYS use docblocks for public methods**
5. **NEVER use raw SQL - use Eloquent**
6. **ALWAYS validate with Form Requests**
7. **NEVER expose API keys in code**

## 📞 Support & Resources

- **Laravel Docs:** https://laravel.com/docs/12.x
- **OpenAI API:** https://platform.openai.com/docs
- **Firecrawl API:** https://docs.firecrawl.dev
- **Project Name:** ProductImageAI.com
- **Environment:** Laravel 12 on macOS
- Always code and comment in english
- We use gpt-5 for all completion and vision. We use gpt-image-1 model for image generation.
- Voeg enkel logs toe als het echt nodig en waardevol is.
- Never use DALL-E as model or reference to image model. We use OpenAI gpt-image-1