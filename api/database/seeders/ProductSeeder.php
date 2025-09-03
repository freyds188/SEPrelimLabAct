<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Weaver;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing weavers
        $weavers = Weaver::where('status', 'active')->get();

        if ($weavers->isEmpty()) {
            // Create weavers if none exist
            $weavers = Weaver::factory(8)->verified()->create();
        }

        // Create diverse test products for comprehensive testing - CORDILLERA ONLY
        $this->createBasketProducts($weavers);
        $this->createMatProducts($weavers);
        $this->createBagProducts($weavers);
        $this->createHatProducts($weavers);
        $this->createDecorativeProducts($weavers);
        $this->createFurnitureProducts($weavers);
        $this->createTextileProducts($weavers);
        $this->createAccessoryProducts($weavers);
        $this->createHomeDecorProducts($weavers);

        // Create featured products
        $this->createFeaturedProducts($weavers);

        // Create out-of-stock products for testing
        $this->createOutOfStockProducts($weavers);

        // Create low-stock products for testing
        $this->createLowStockProducts($weavers);

        // Create expensive products for price range testing
        $this->createExpensiveProducts($weavers);

        // Create affordable products for price range testing
        $this->createAffordableProducts($weavers);

        $this->command->info('✅ Created comprehensive Cordillera-only test products for catalog and checkout testing!');
    }

    private function createBasketProducts($weavers)
    {
        $basketNames = [
            'Traditional Ifugao Rice Basket',
            'Kalinga Harvest Basket',
            'Bontoc Storage Basket',
            'Igorot Rattan Fruit Basket',
            'Ibaloi Bamboo Kitchen Basket',
            'Kankanaey Abaca Market Basket',
            'Ifugao Palm Leaf Picnic Basket',
            'Kalinga Coiled Storage Basket',
            'Bontoc Woven Utility Basket',
            'Igorot Handcrafted Gift Basket'
        ];

        // ONLY Cordillera tribes
        $cordilleraTribes = ['Ifugao', 'Kalinga', 'Bontoc', 'Igorot', 'Ibaloi', 'Kankanaey'];
        // ONLY Cordillera regions
        $cordilleraRegions = ['Cordillera Administrative Region', 'Benguet', 'Ifugao', 'Kalinga', 'Apayao', 'Mountain Province', 'Abra'];

        foreach ($basketNames as $index => $name) {
            $weaver = $weavers->random();
            Product::factory()
                ->basket()
                ->state([
                    'weaver_id' => $weaver->id,
                    'name' => $name,
                    'slug' => \Illuminate\Support\Str::slug($name),
                    'price' => rand(200, 1500),
                    'stock_quantity' => rand(5, 25),
                    'tribe' => $cordilleraTribes[array_rand($cordilleraTribes)],
                    'origin_region' => $cordilleraRegions[array_rand($cordilleraRegions)],
                    'rating' => rand(35, 50) / 10,
                    'reviews_count' => rand(5, 30),
                ])
                ->create();
        }
    }

    private function createMatProducts($weavers)
    {
        $matNames = [
            'Traditional Ifugao Sleeping Mat',
            'Kalinga Seagrass Floor Mat',
            'Bontoc Tikog Dining Mat',
            'Igorot Palm Leaf Welcome Mat',
            'Ibaloi Woven Bathroom Mat',
            'Kankanaey Natural Fiber Doormat',
            'Ifugao Handwoven Table Mat',
            'Kalinga Eco-friendly Kitchen Mat',
            'Bontoc Traditional Prayer Mat',
            'Igorot Decorative Wall Mat'
        ];

        // ONLY Cordillera tribes
        $cordilleraTribes = ['Ifugao', 'Kalinga', 'Bontoc', 'Igorot', 'Ibaloi', 'Kankanaey'];
        // ONLY Cordillera regions
        $cordilleraRegions = ['Cordillera Administrative Region', 'Benguet', 'Ifugao', 'Kalinga', 'Apayao', 'Mountain Province', 'Abra'];

        foreach ($matNames as $index => $name) {
            $weaver = $weavers->random();
            Product::factory()
                ->mat()
                ->state([
                    'weaver_id' => $weaver->id,
                    'name' => $name,
                    'slug' => \Illuminate\Support\Str::slug($name),
                    'price' => rand(150, 800),
                    'stock_quantity' => rand(3, 20),
                    'tribe' => $cordilleraTribes[array_rand($cordilleraTribes)],
                    'origin_region' => $cordilleraRegions[array_rand($cordilleraRegions)],
                    'rating' => rand(35, 50) / 10,
                    'reviews_count' => rand(3, 25),
                ])
                ->create();
        }
    }

    private function createBagProducts($weavers)
    {
        $bagNames = [
            'Traditional Ifugao Shoulder Bag',
            'Kalinga Abaca Market Bag',
            'Bontoc Banana Fiber Tote',
            'Igorot Coconut Coir Shopping Bag',
            'Ibaloi Handwoven Crossbody Bag',
            'Kankanaey Beaded Evening Bag',
            'Ifugao Embroidered Clutch',
            'Kalinga Natural Fiber Backpack',
            'Bontoc Traditional Rice Bag',
            'Igorot Artisan Gift Bag'
        ];

        // ONLY Cordillera tribes
        $cordilleraTribes = ['Ifugao', 'Kalinga', 'Bontoc', 'Igorot', 'Ibaloi', 'Kankanaey'];
        // ONLY Cordillera regions
        $cordilleraRegions = ['Cordillera Administrative Region', 'Benguet', 'Ifugao', 'Kalinga', 'Apayao', 'Mountain Province', 'Abra'];

        foreach ($bagNames as $index => $name) {
            $weaver = $weavers->random();
            Product::factory()
                ->bag()
                ->state([
                    'weaver_id' => $weaver->id,
                    'name' => $name,
                    'slug' => \Illuminate\Support\Str::slug($name),
                    'price' => rand(300, 2000),
                    'stock_quantity' => rand(2, 15),
                    'tribe' => $cordilleraTribes[array_rand($cordilleraTribes)],
                    'origin_region' => $cordilleraRegions[array_rand($cordilleraRegions)],
                    'rating' => rand(40, 50) / 10,
                    'reviews_count' => rand(5, 35),
                ])
                ->create();
        }
    }

    private function createHatProducts($weavers)
    {
        $hatNames = [
            'Traditional Ifugao Bamboo Hat',
            'Kalinga Palm Leaf Sun Hat',
            'Bontoc Rattan Garden Hat',
            'Igorot Woven Beach Hat',
            'Ibaloi Handcrafted Festival Hat',
            'Kankanaey Natural Fiber Cap',
            'Ifugao Traditional Farmer Hat',
            'Kalinga Artisan Summer Hat',
            'Bontoc Bamboo Rain Hat',
            'Igorot Palm Leaf Party Hat'
        ];

        // ONLY Cordillera tribes
        $cordilleraTribes = ['Ifugao', 'Kalinga', 'Bontoc', 'Igorot', 'Ibaloi', 'Kankanaey'];
        // ONLY Cordillera regions
        $cordilleraRegions = ['Cordillera Administrative Region', 'Benguet', 'Ifugao', 'Kalinga', 'Apayao', 'Mountain Province', 'Abra'];

        foreach ($hatNames as $index => $name) {
            $weaver = $weavers->random();
            Product::factory()
                ->hat()
                ->state([
                    'weaver_id' => $weaver->id,
                    'name' => $name,
                    'slug' => \Illuminate\Support\Str::slug($name),
                    'price' => rand(100, 500),
                    'stock_quantity' => rand(8, 30),
                    'tribe' => $cordilleraTribes[array_rand($cordilleraTribes)],
                    'origin_region' => $cordilleraRegions[array_rand($cordilleraRegions)],
                    'rating' => rand(35, 50) / 10,
                    'reviews_count' => rand(2, 20),
                ])
                ->create();
        }
    }

    private function createDecorativeProducts($weavers)
    {
        $decorativeNames = [
            'Traditional Ifugao Wall Hanging',
            'Kalinga Handwoven Dream Catcher',
            'Bontoc Bamboo Wind Chime',
            'Igorot Rattan Wall Art',
            'Ibaloi Abaca Decorative Bowl',
            'Kankanaey Palm Leaf Wall Panel',
            'Ifugao Handcrafted Mobile',
            'Kalinga Natural Fiber Garland',
            'Bontoc Traditional Mask',
            'Igorot Artisan Wall Clock'
        ];

        // ONLY Cordillera tribes
        $cordilleraTribes = ['Ifugao', 'Kalinga', 'Bontoc', 'Igorot', 'Ibaloi', 'Kankanaey'];
        // ONLY Cordillera regions
        $cordilleraRegions = ['Cordillera Administrative Region', 'Benguet', 'Ifugao', 'Kalinga', 'Apayao', 'Mountain Province', 'Abra'];

        foreach ($decorativeNames as $index => $name) {
            $weaver = $weavers->random();
            Product::factory()
                ->state([
                    'weaver_id' => $weaver->id,
                    'name' => $name,
                    'slug' => \Illuminate\Support\Str::slug($name),
                    'category' => 'Decorative Items',
                    'price' => rand(250, 1200),
                    'stock_quantity' => rand(3, 18),
                    'tribe' => $cordilleraTribes[array_rand($cordilleraTribes)],
                    'origin_region' => $cordilleraRegions[array_rand($cordilleraRegions)],
                    'technique' => ['Beading', 'Embroidery', 'Carving', 'Dyeing'][rand(0, 3)],
                    'rating' => rand(40, 50) / 10,
                    'reviews_count' => rand(4, 28),
                ])
                ->create();
        }
    }

    private function createFurnitureProducts($weavers)
    {
        $furnitureNames = [
            'Ifugao Bamboo Side Table',
            'Kalinga Rattan Armchair',
            'Bontoc Abaca Stool',
            'Igorot Palm Leaf Bench',
            'Ibaloi Handwoven Cushion',
            'Kankanaey Natural Fiber Ottoman',
            'Ifugao Traditional Floor Cushion',
            'Kalinga Bamboo Shelf Unit',
            'Bontoc Rattan Magazine Rack',
            'Igorot Handcrafted Footstool'
        ];

        // ONLY Cordillera tribes
        $cordilleraTribes = ['Ifugao', 'Kalinga', 'Bontoc', 'Igorot', 'Ibaloi', 'Kankanaey'];
        // ONLY Cordillera regions
        $cordilleraRegions = ['Cordillera Administrative Region', 'Benguet', 'Ifugao', 'Kalinga', 'Apayao', 'Mountain Province', 'Abra'];

        foreach ($furnitureNames as $index => $name) {
            $weaver = $weavers->random();
            Product::factory()
                ->state([
                    'weaver_id' => $weaver->id,
                    'name' => $name,
                    'slug' => \Illuminate\Support\Str::slug($name),
                    'category' => 'Furniture',
                    'price' => rand(800, 3500),
                    'stock_quantity' => rand(1, 8),
                    'tribe' => $cordilleraTribes[array_rand($cordilleraTribes)],
                    'origin_region' => $cordilleraRegions[array_rand($cordilleraRegions)],
                    'technique' => ['Weaving', 'Carving', 'Sewing'][rand(0, 2)],
                    'rating' => rand(40, 50) / 10,
                    'reviews_count' => rand(6, 32),
                ])
                ->create();
        }
    }

    private function createTextileProducts($weavers)
    {
        $textileNames = [
            'Traditional Ifugao Weaving',
            'Kalinga Handwoven Table Runner',
            'Bontoc Abaca Placemat Set',
            'Igorot Bamboo Fiber Towel',
            'Ibaloi Natural Fiber Napkins',
            'Kankanaey Handcrafted Coaster Set',
            'Ifugao Traditional Textile Panel',
            'Kalinga Woven Wall Hanging',
            'Bontoc Artisan Fabric Swatch',
            'Igorot Handmade Textile Art'
        ];

        // ONLY Cordillera tribes
        $cordilleraTribes = ['Ifugao', 'Kalinga', 'Bontoc', 'Igorot', 'Ibaloi', 'Kankanaey'];
        // ONLY Cordillera regions
        $cordilleraRegions = ['Cordillera Administrative Region', 'Benguet', 'Ifugao', 'Kalinga', 'Apayao', 'Mountain Province', 'Abra'];

        foreach ($textileNames as $index => $name) {
            $weaver = $weavers->random();
            Product::factory()
                ->state([
                    'weaver_id' => $weaver->id,
                    'name' => $name,
                    'slug' => \Illuminate\Support\Str::slug($name),
                    'category' => 'Textiles',
                    'price' => rand(180, 900),
                    'stock_quantity' => rand(4, 22),
                    'tribe' => $cordilleraTribes[array_rand($cordilleraTribes)],
                    'technique' => ['Weaving', 'Embroidery', 'Dyeing'][rand(0, 2)],
                    'tribe' => $cordilleraTribes[array_rand($cordilleraTribes)],
                    'origin_region' => $cordilleraRegions[array_rand($cordilleraRegions)],
                    'rating' => rand(35, 50) / 10,
                    'reviews_count' => rand(3, 26),
                ])
                ->create();
        }
    }

    private function createAccessoryProducts($weavers)
    {
        $accessoryNames = [
            'Ifugao Bamboo Jewelry Box',
            'Kalinga Rattan Keychain',
            'Bontoc Abaca Wallet',
            'Igorot Palm Leaf Belt',
            'Ibaloi Handwoven Bracelet',
            'Kankanaey Natural Fiber Necklace',
            'Ifugao Traditional Hair Accessory',
            'Kalinga Artisan Sunglasses Case',
            'Bontoc Handcrafted Watch Band',
            'Igorot Bamboo Phone Holder'
        ];

        // ONLY Cordillera tribes
        $cordilleraTribes = ['Ifugao', 'Kalinga', 'Bontoc', 'Igorot', 'Ibaloi', 'Kankanaey'];
        // ONLY Cordillera regions
        $cordilleraRegions = ['Cordillera Administrative Region', 'Benguet', 'Ifugao', 'Kalinga', 'Apayao', 'Mountain Province', 'Abra'];

        foreach ($accessoryNames as $index => $name) {
            $weaver = $weavers->random();
            Product::factory()
                ->state([
                    'weaver_id' => $weaver->id,
                    'name' => $name,
                    'slug' => \Illuminate\Support\Str::slug($name),
                    'category' => 'Accessories',
                    'price' => rand(120, 600),
                    'stock_quantity' => rand(6, 25),
                    'tribe' => $cordilleraTribes[array_rand($cordilleraTribes)],
                    'origin_region' => $cordilleraRegions[array_rand($cordilleraRegions)],
                    'technique' => ['Beading', 'Sewing', 'Wrapping'][rand(0, 2)],
                    'rating' => rand(35, 50) / 10,
                    'reviews_count' => rand(2, 24),
                ])
                ->create();
        }
    }

    private function createHomeDecorProducts($weavers)
    {
        $homeDecorNames = [
            'Ifugao Bamboo Vase',
            'Kalinga Rattan Lamp Shade',
            'Bontoc Abaca Plant Holder',
            'Igorot Palm Leaf Mirror Frame',
            'Ibaloi Handwoven Throw Pillow',
            'Kankanaey Natural Fiber Rug',
            'Ifugao Traditional Candle Holder',
            'Kalinga Artisan Photo Frame',
            'Bontoc Handcrafted Bookend',
            'Igorot Bamboo Tissue Box Cover'
        ];

        // ONLY Cordillera tribes
        $cordilleraTribes = ['Ifugao', 'Kalinga', 'Bontoc', 'Igorot', 'Ibaloi', 'Kankanaey'];
        // ONLY Cordillera regions
        $cordilleraRegions = ['Cordillera Administrative Region', 'Benguet', 'Ifugao', 'Kalinga', 'Apayao', 'Mountain Province', 'Abra'];

        foreach ($homeDecorNames as $index => $name) {
            $weaver = $weavers->random();
            Product::factory()
                ->state([
                    'weaver_id' => $weaver->id,
                    'name' => $name,
                    'slug' => \Illuminate\Support\Str::slug($name),
                    'category' => 'Home Decor',
                    'price' => rand(200, 1000),
                    'stock_quantity' => rand(3, 20),
                    'tribe' => $cordilleraTribes[array_rand($cordilleraTribes)],
                    'origin_region' => $cordilleraRegions[array_rand($cordilleraRegions)],
                    'technique' => ['Weaving', 'Carving', 'Sewing'][rand(0, 2)],
                    'rating' => rand(35, 50) / 10,
                    'reviews_count' => rand(4, 30),
                ])
                ->create();
        }
    }

    private function createFeaturedProducts($weavers)
    {
        $featuredNames = [
            'Premium Ifugao Rice Basket',
            'Luxury Kalinga Harvest Basket',
            'Exclusive Bontoc Storage Basket',
            'Artisan Igorot Rattan Fruit Basket',
            'Signature Ibaloi Bamboo Kitchen Basket',
            'Premium Kankanaey Abaca Market Basket',
            'Luxury Ifugao Palm Leaf Picnic Basket',
            'Exclusive Kalinga Coiled Storage Basket',
            'Artisan Bontoc Woven Utility Basket',
            'Signature Igorot Handcrafted Gift Basket'
        ];

        // ONLY Cordillera tribes
        $cordilleraTribes = ['Ifugao', 'Kalinga', 'Bontoc', 'Igorot', 'Ibaloi', 'Kankanaey'];
        // ONLY Cordillera regions
        $cordilleraRegions = ['Cordillera Administrative Region', 'Benguet', 'Ifugao', 'Kalinga', 'Apayao', 'Mountain Province', 'Abra'];

        foreach ($featuredNames as $index => $name) {
            $weaver = $weavers->random();
            Product::factory()
                ->featured()
                ->state([
                    'weaver_id' => $weaver->id,
                    'name' => $name,
                    'slug' => \Illuminate\Support\Str::slug($name),
                    'price' => rand(500, 3000),
                    'stock_quantity' => rand(2, 10),
                    'tribe' => $cordilleraTribes[array_rand($cordilleraTribes)],
                    'origin_region' => $cordilleraRegions[array_rand($cordilleraRegions)],
                    'rating' => rand(45, 50) / 10,
                    'reviews_count' => rand(15, 50),
                ])
                ->create();
        }
    }

    private function createOutOfStockProducts($weavers)
    {
        $outOfStockNames = [
            'Rare Ifugao Traditional Basket',
            'Limited Edition Kalinga Mat',
            'Exclusive Bontoc Handbag',
            'Collector Igorot Hat',
            'Vintage Ibaloi Decorative Item',
            'Antique Kankanaey Furniture Piece',
            'Heritage Ifugao Textile',
            'Rare Kalinga Accessory',
            'Limited Bontoc Home Decor',
            'Exclusive Igorot Artisan Piece'
        ];

        // ONLY Cordillera tribes
        $cordilleraTribes = ['Ifugao', 'Kalinga', 'Bontoc', 'Igorot', 'Ibaloi', 'Kankanaey'];
        // ONLY Cordillera regions
        $cordilleraRegions = ['Cordillera Administrative Region', 'Benguet', 'Ifugao', 'Kalinga', 'Apayao', 'Mountain Province', 'Abra'];

        foreach ($outOfStockNames as $index => $name) {
            $weaver = $weavers->random();
            Product::factory()
                ->outOfStock()
                ->state([
                    'weaver_id' => $weaver->id,
                    'name' => $name,
                    'slug' => \Illuminate\Support\Str::slug($name),
                    'price' => rand(300, 2000),
                    'tribe' => $cordilleraTribes[array_rand($cordilleraTribes)],
                    'origin_region' => $cordilleraRegions[array_rand($cordilleraRegions)],
                    'rating' => rand(40, 50) / 10,
                    'reviews_count' => rand(5, 25),
                ])
            ->create();
        }
    }

    private function createLowStockProducts($weavers)
    {
        $lowStockNames = [
            'Popular Ifugao Traditional Basket',
            'Trending Kalinga Handwoven Mat',
            'Best-selling Bontoc Bag',
            'Fashionable Igorot Hat',
            'Popular Ibaloi Decorative Item',
            'Trending Kankanaey Furniture',
            'Best-selling Ifugao Textile',
            'Popular Kalinga Accessory',
            'Trending Bontoc Home Decor',
            'Fashionable Igorot Artisan Piece'
        ];

        // ONLY Cordillera tribes
        $cordilleraTribes = ['Ifugao', 'Kalinga', 'Bontoc', 'Igorot', 'Ibaloi', 'Kankanaey'];
        // ONLY Cordillera regions
        $cordilleraRegions = ['Cordillera Administrative Region', 'Benguet', 'Ifugao', 'Kalinga', 'Apayao', 'Mountain Province', 'Abra'];

        foreach ($lowStockNames as $index => $name) {
            $weaver = $weavers->random();
            Product::factory()
                ->state([
                    'weaver_id' => $weaver->id,
                    'name' => $name,
                    'slug' => \Illuminate\Support\Str::slug($name),
                    'price' => rand(200, 1500),
                    'stock_quantity' => rand(1, 5), // Low stock
                    'tribe' => $cordilleraTribes[array_rand($cordilleraTribes)],
                    'origin_region' => $cordilleraRegions[array_rand($cordilleraRegions)],
                    'rating' => rand(40, 50) / 10,
                    'reviews_count' => rand(8, 35),
                ])
                ->create();
        }
    }

    private function createExpensiveProducts($weavers)
    {
        $expensiveNames = [
            'Luxury Ifugao Traditional Basket',
            'Premium Kalinga Artisan Mat',
            'Exclusive Bontoc Designer Bag',
            'High-end Igorot Fashion Hat',
            'Luxury Ibaloi Decorative Piece',
            'Premium Kankanaey Furniture Item',
            'Exclusive Ifugao Textile Art',
            'Luxury Kalinga Accessory',
            'Premium Bontoc Home Decor',
            'High-end Igorot Artisan Creation'
        ];

        // ONLY Cordillera tribes
        $cordilleraTribes = ['Ifugao', 'Kalinga', 'Bontoc', 'Igorot', 'Ibaloi', 'Kankanaey'];
        // ONLY Cordillera regions
        $cordilleraRegions = ['Cordillera Administrative Region', 'Benguet', 'Ifugao', 'Kalinga', 'Apayao', 'Mountain Province', 'Abra'];

        foreach ($expensiveNames as $index => $name) {
            $weaver = $weavers->random();
            Product::factory()
                ->state([
                    'weaver_id' => $weaver->id,
                    'name' => $name,
                    'slug' => \Illuminate\Support\Str::slug($name),
                    'price' => rand(2000, 8000), // Expensive range
                    'stock_quantity' => rand(1, 8),
                    'tribe' => $cordilleraTribes[array_rand($cordilleraTribes)],
                    'origin_region' => $cordilleraRegions[array_rand($cordilleraRegions)],
                    'rating' => rand(45, 50) / 10,
                    'reviews_count' => rand(10, 40),
                ])
                ->create();
        }
    }

    private function createAffordableProducts($weavers)
    {
        $affordableNames = [
            'Budget Ifugao Traditional Basket',
            'Affordable Kalinga Handwoven Mat',
            'Economy Bontoc Bag',
            'Budget-friendly Igorot Hat',
            'Affordable Ibaloi Decorative Item',
            'Economy Kankanaey Furniture',
            'Budget Ifugao Textile',
            'Affordable Kalinga Accessory',
            'Economy Bontoc Home Decor',
            'Budget Igorot Artisan Piece'
        ];

        // ONLY Cordillera tribes
        $cordilleraTribes = ['Ifugao', 'Kalinga', 'Bontoc', 'Igorot', 'Ibaloi', 'Kankanaey'];
        // ONLY Cordillera regions
        $cordilleraRegions = ['Cordillera Administrative Region', 'Benguet', 'Ifugao', 'Kalinga', 'Apayao', 'Mountain Province', 'Abra'];

        foreach ($affordableNames as $index => $name) {
            $weaver = $weavers->random();
            Product::factory()
                ->state([
                    'weaver_id' => $weaver->id,
                    'name' => $name,
                    'slug' => \Illuminate\Support\Str::slug($name),
                    'price' => rand(50, 300), // Affordable range
                    'stock_quantity' => rand(10, 40),
                    'tribe' => $cordilleraTribes[array_rand($cordilleraTribes)],
                    'origin_region' => $cordilleraRegions[array_rand($cordilleraRegions)],
                    'rating' => rand(35, 50) / 10,
                    'reviews_count' => rand(2, 20),
                ])
                ->create();
        }
    }
}
