# Laravel API Structure - Weaver Platform

## File Tree Overview

```
api/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   ├── WeaverController.php
│   │   │   │   ├── ProductController.php
│   │   │   │   ├── StoryController.php
│   │   │   │   ├── CampaignController.php
│   │   │   │   └── GlossaryTermController.php
│   │   │   └── Controller.php
│   │   ├── Requests/
│   │   │   ├── Weaver/
│   │   │   │   ├── StoreWeaverRequest.php
│   │   │   │   └── UpdateWeaverRequest.php
│   │   │   └── Product/
│   │   │       ├── StoreProductRequest.php
│   │   │       └── UpdateProductRequest.php
│   │   └── Kernel.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Weaver.php
│   │   ├── Product.php
│   │   ├── Order.php
│   │   ├── Payout.php
│   │   ├── Story.php
│   │   ├── Campaign.php
│   │   ├── Donation.php
│   │   ├── GlossaryTerm.php
│   │   └── Media.php
│   └── Providers/
├── database/
│   ├── factories/
│   │   ├── WeaverFactory.php
│   │   ├── ProductFactory.php
│   │   ├── StoryFactory.php
│   │   ├── CampaignFactory.php
│   │   └── GlossaryTermFactory.php
│   ├── migrations/
│   │   ├── create_weavers_table.php
│   │   ├── create_products_table.php
│   │   ├── create_orders_table.php
│   │   ├── create_payouts_table.php
│   │   ├── create_stories_table.php
│   │   ├── create_campaigns_table.php
│   │   ├── create_donations_table.php
│   │   ├── create_glossary_terms_table.php
│   │   └── create_media_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── WeaverSeeder.php
│       ├── ProductSeeder.php
│       └── GlossaryTermSeeder.php
└── routes/
    └── api.php
```

## Database Schema

### Core Tables
1. **users** - User authentication and profiles
2. **weavers** - Weaver profiles and information
3. **products** - Weaver products for sale
4. **orders** - Customer orders and transactions
5. **payouts** - Weaver payment distributions
6. **stories** - Weaver stories and content
7. **campaigns** - Fundraising campaigns
8. **donations** - Campaign donations
9. **glossary_terms** - Weaving terminology
10. **media** - File management (polymorphic)

## API Endpoints

### Public Routes (No Authentication)
- `GET /api/v1/weavers` - List weavers with filtering
- `GET /api/v1/weavers/featured` - Featured weavers
- `GET /api/v1/weavers/{id}` - Get weaver details
- `GET /api/v1/products` - List products with filtering
- `GET /api/v1/products/featured` - Featured products
- `GET /api/v1/products/category/{category}` - Products by category
- `GET /api/v1/products/{id}` - Get product details
- `GET /api/v1/stories` - List stories
- `GET /api/v1/stories/featured` - Featured stories
- `GET /api/v1/stories/{id}` - Get story details
- `GET /api/v1/campaigns` - List campaigns
- `GET /api/v1/campaigns/featured` - Featured campaigns
- `GET /api/v1/campaigns/{id}` - Get campaign details
- `GET /api/v1/glossary` - List glossary terms
- `GET /api/v1/glossary/featured` - Featured terms
- `GET /api/v1/glossary/search` - Search terms
- `GET /api/v1/glossary/{id}` - Get term details

### Protected Routes (Authentication Required)
- `POST /api/v1/weavers` - Create weaver profile
- `PUT /api/v1/weavers/{id}` - Update weaver profile
- `DELETE /api/v1/weavers/{id}` - Delete weaver profile
- `POST /api/v1/products` - Create product
- `PUT /api/v1/products/{id}` - Update product
- `DELETE /api/v1/products/{id}` - Delete product
- `POST /api/v1/stories` - Create story
- `PUT /api/v1/stories/{id}` - Update story
- `DELETE /api/v1/stories/{id}` - Delete story
- `POST /api/v1/campaigns` - Create campaign
- `PUT /api/v1/campaigns/{id}` - Update campaign
- `DELETE /api/v1/campaigns/{id}` - Delete campaign
- `POST /api/v1/glossary` - Create glossary term
- `PUT /api/v1/glossary/{id}` - Update glossary term
- `DELETE /api/v1/glossary/{id}` - Delete glossary term

## Key Features

### Models with Relationships
- **User** ↔ **Weaver** (One-to-One)
- **Weaver** ↔ **Product** (One-to-Many)
- **Weaver** ↔ **Order** (One-to-Many)
- **Weaver** ↔ **Payout** (One-to-Many)
- **Weaver** ↔ **Story** (One-to-Many)
- **Campaign** ↔ **Donation** (One-to-Many)
- **Media** ↔ **All Models** (Polymorphic)

### Validation Rules
- Comprehensive FormRequest classes for data validation
- Custom validation messages
- Unique constraints and relationship validation

### Factory & Seeder Data
- Realistic weaver profiles with Filipino locations
- Authentic weaving products and categories
- Traditional weaving terminology
- Campaign and story content

### API Features
- Pagination support
- Filtering and search capabilities
- Sorting options
- Relationship loading
- View counting
- Featured content endpoints

### Security
- Sanctum authentication for protected routes
- Input validation and sanitization
- Proper error handling
- Rate limiting ready

## Usage Examples

### Get Featured Weavers
```bash
GET /api/v1/weavers/featured
```

### Search Products
```bash
GET /api/v1/products?search=basket&category=Baskets&min_price=100&max_price=1000
```

### Create Product (Authenticated)
```bash
POST /api/v1/products
Authorization: Bearer {token}
{
  "weaver_id": 1,
  "name": "Traditional Rattan Basket",
  "description": "Handcrafted rattan basket...",
  "price": 1500.00,
  "stock_quantity": 5,
  "category": "Baskets"
}
```

## Development Setup

1. **Run Migrations**
   ```bash
   php artisan migrate
   ```

2. **Seed Database**
   ```bash
   php artisan db:seed
   ```

3. **Generate API Token**
   ```bash
   php artisan sanctum:install
   ```

4. **Test API**
   ```bash
   php artisan serve
   ```

## Data Seeding Results

- **23 Weavers** (3 featured, 15 verified, 5 inactive)
- **100+ Products** (2-5 per weaver, some featured)
- **30 Glossary Terms** (5 featured, 20 published, 5 draft)
- **Realistic Filipino weaving data**
- **Proper relationships and constraints**
