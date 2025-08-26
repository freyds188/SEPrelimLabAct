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

        // Create diverse test products for comprehensive testing
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

        $this->command->info('✅ Created comprehensive test products for catalog and checkout testing!');
    }

    private function createBasketProducts($weavers)
    {
        $basketNames = [
            'Traditional Ifugao Rice Basket',
            'Kalinga Harvest Basket',
            'Bontoc Storage Basket',
            'Rattan Fruit Basket',
            'Bamboo Kitchen Basket',
            'Abaca Market Basket',
            'Palm Leaf Picnic Basket',
            'Coiled Storage Basket',
            'Woven Utility Basket',
            'Handcrafted Gift Basket'
        ];

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
                    'tribe' => ['Ifugao', 'Kalinga', 'Bontoc', 'Igorot'][rand(0, 3)],
                    'rating' => rand(35, 50) / 10,
                    'reviews_count' => rand(5, 30),
                ])
                ->create();
        }
    }

    private function createMatProducts($weavers)
    {
        $matNames = [
            'Traditional Sleeping Mat',
            'Seagrass Floor Mat',
            'Tikog Dining Mat',
            'Palm Leaf Welcome Mat',
            'Woven Bathroom Mat',
            'Natural Fiber Doormat',
            'Handwoven Table Mat',
            'Eco-friendly Kitchen Mat',
            'Traditional Prayer Mat',
            'Decorative Wall Mat'
        ];

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
                    'tribe' => ['T\'boli', 'Mangyan', 'Aeta', 'Lumad'][rand(0, 3)],
                    'rating' => rand(35, 50) / 10,
                    'reviews_count' => rand(3, 25),
                ])
                ->create();
        }
    }

    private function createBagProducts($weavers)
    {
        $bagNames = [
            'Traditional Shoulder Bag',
            'Abaca Market Bag',
            'Banana Fiber Tote',
            'Coconut Coir Shopping Bag',
            'Handwoven Crossbody Bag',
            'Beaded Evening Bag',
            'Embroidered Clutch',
            'Natural Fiber Backpack',
            'Traditional Rice Bag',
            'Artisan Gift Bag'
        ];

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
                    'tribe' => ['Badjao', 'Yakan', 'T\'boli', 'Mangyan'][rand(0, 3)],
                    'rating' => rand(40, 50) / 10,
                    'reviews_count' => rand(5, 35),
                ])
                ->create();
        }
    }

    private function createHatProducts($weavers)
    {
        $hatNames = [
            'Traditional Bamboo Hat',
            'Palm Leaf Sun Hat',
            'Rattan Garden Hat',
            'Woven Beach Hat',
            'Handcrafted Festival Hat',
            'Natural Fiber Cap',
            'Traditional Farmer Hat',
            'Artisan Summer Hat',
            'Bamboo Rain Hat',
            'Palm Leaf Party Hat'
        ];

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
                    'tribe' => ['Ifugao', 'Kalinga', 'Bontoc', 'Igorot'][rand(0, 3)],
                    'rating' => rand(35, 50) / 10,
                    'reviews_count' => rand(2, 20),
                ])
                ->create();
        }
    }

    private function createDecorativeProducts($weavers)
    {
        $decorativeNames = [
            'Traditional Wall Hanging',
            'Handwoven Dream Catcher',
            'Bamboo Wind Chime',
            'Rattan Wall Art',
            'Abaca Decorative Bowl',
            'Palm Leaf Wall Panel',
            'Handcrafted Mobile',
            'Natural Fiber Garland',
            'Traditional Mask',
            'Artisan Wall Clock'
        ];

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
            'Bamboo Side Table',
            'Rattan Armchair',
            'Abaca Stool',
            'Palm Leaf Bench',
            'Handwoven Cushion',
            'Natural Fiber Ottoman',
            'Traditional Floor Cushion',
            'Bamboo Shelf Unit',
            'Rattan Magazine Rack',
            'Handcrafted Footstool'
        ];

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
            'Traditional Weaving',
            'Handwoven Table Runner',
            'Abaca Placemat Set',
            'Bamboo Fiber Towel',
            'Natural Fiber Napkins',
            'Handcrafted Coaster Set',
            'Traditional Textile Panel',
            'Woven Wall Hanging',
            'Artisan Fabric Swatch',
            'Handmade Textile Art'
        ];

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
                    'technique' => ['Weaving', 'Embroidery', 'Dyeing'][rand(0, 2)],
                    'rating' => rand(35, 50) / 10,
                    'reviews_count' => rand(3, 26),
                ])
                ->create();
        }
    }

    private function createAccessoryProducts($weavers)
    {
        $accessoryNames = [
            'Bamboo Jewelry Box',
            'Rattan Keychain',
            'Abaca Wallet',
            'Palm Leaf Belt',
            'Handwoven Bracelet',
            'Natural Fiber Necklace',
            'Traditional Hair Accessory',
            'Artisan Sunglasses Case',
            'Handcrafted Watch Band',
            'Bamboo Phone Holder'
        ];

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
            'Bamboo Vase',
            'Rattan Lamp Shade',
            'Abaca Plant Holder',
            'Palm Leaf Mirror Frame',
            'Handwoven Throw Pillow',
            'Natural Fiber Rug',
            'Traditional Candle Holder',
            'Artisan Photo Frame',
            'Handcrafted Bookend',
            'Bamboo Tissue Box Cover'
        ];

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
            'Artisan Rattan Fruit Basket',
            'Signature Bamboo Kitchen Basket',
            'Premium Abaca Market Basket',
            'Luxury Palm Leaf Picnic Basket',
            'Exclusive Coiled Storage Basket',
            'Artisan Woven Utility Basket',
            'Signature Handcrafted Gift Basket'
        ];

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
                    'rating' => rand(45, 50) / 10,
                    'reviews_count' => rand(15, 50),
                ])
                ->create();
        }
    }

    private function createOutOfStockProducts($weavers)
    {
        $outOfStockNames = [
            'Rare Traditional Basket',
            'Limited Edition Mat',
            'Exclusive Handbag',
            'Collector Hat',
            'Vintage Decorative Item',
            'Antique Furniture Piece',
            'Heritage Textile',
            'Rare Accessory',
            'Limited Home Decor',
            'Exclusive Artisan Piece'
        ];

        foreach ($outOfStockNames as $index => $name) {
            $weaver = $weavers->random();
            Product::factory()
                ->outOfStock()
                ->state([
                    'weaver_id' => $weaver->id,
                    'name' => $name,
                    'slug' => \Illuminate\Support\Str::slug($name),
                    'price' => rand(300, 2000),
                    'rating' => rand(40, 50) / 10,
                    'reviews_count' => rand(5, 25),
                ])
            ->create();
        }
    }

    private function createLowStockProducts($weavers)
    {
        $lowStockNames = [
            'Popular Traditional Basket',
            'Trending Handwoven Mat',
            'Best-selling Bag',
            'Fashionable Hat',
            'Popular Decorative Item',
            'Trending Furniture',
            'Best-selling Textile',
            'Popular Accessory',
            'Trending Home Decor',
            'Fashionable Artisan Piece'
        ];

        foreach ($lowStockNames as $index => $name) {
            $weaver = $weavers->random();
            Product::factory()
                ->state([
                    'weaver_id' => $weaver->id,
                    'name' => $name,
                    'slug' => \Illuminate\Support\Str::slug($name),
                    'price' => rand(200, 1500),
                    'stock_quantity' => rand(1, 5), // Low stock
                    'rating' => rand(40, 50) / 10,
                    'reviews_count' => rand(8, 35),
                ])
                ->create();
        }
    }

    private function createExpensiveProducts($weavers)
    {
        $expensiveNames = [
            'Luxury Traditional Basket',
            'Premium Artisan Mat',
            'Exclusive Designer Bag',
            'High-end Fashion Hat',
            'Luxury Decorative Piece',
            'Premium Furniture Item',
            'Exclusive Textile Art',
            'Luxury Accessory',
            'Premium Home Decor',
            'High-end Artisan Creation'
        ];

        foreach ($expensiveNames as $index => $name) {
            $weaver = $weavers->random();
            Product::factory()
                ->state([
                    'weaver_id' => $weaver->id,
                    'name' => $name,
                    'slug' => \Illuminate\Support\Str::slug($name),
                    'price' => rand(2000, 8000), // Expensive range
                    'stock_quantity' => rand(1, 8),
                    'rating' => rand(45, 50) / 10,
                    'reviews_count' => rand(10, 40),
                ])
                ->create();
        }
    }

    private function createAffordableProducts($weavers)
    {
        $affordableNames = [
            'Budget Traditional Basket',
            'Affordable Handwoven Mat',
            'Economy Bag',
            'Budget-friendly Hat',
            'Affordable Decorative Item',
            'Economy Furniture',
            'Budget Textile',
            'Affordable Accessory',
            'Economy Home Decor',
            'Budget Artisan Piece'
        ];

        foreach ($affordableNames as $index => $name) {
            $weaver = $weavers->random();
            Product::factory()
                ->state([
                    'weaver_id' => $weaver->id,
                    'name' => $name,
                    'slug' => \Illuminate\Support\Str::slug($name),
                    'price' => rand(50, 300), // Affordable range
                    'stock_quantity' => rand(10, 40),
                    'rating' => rand(35, 50) / 10,
                    'reviews_count' => rand(2, 20),
                ])
                ->create();
        }
    }
}
