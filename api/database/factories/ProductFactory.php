<?php

namespace Database\Factories;

use App\Models\Weaver;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
            'Baskets', 'Mats', 'Bags', 'Hats', 'Decorative Items',
            'Furniture', 'Textiles', 'Accessories', 'Home Decor'
        ];

        // ONLY Cordillera tribes
        $tribes = [
            'Ifugao', 'Kalinga', 'Bontoc', 'Igorot', 'Ibaloi', 'Kankanaey'
        ];

        $techniques = [
            'Coiling', 'Plaiting', 'Twining', 'Wrapping', 'Sewing',
            'Beading', 'Embroidery', 'Dyeing', 'Weaving', 'Carving'
        ];

        $materials = [
            'Rattan', 'Bamboo', 'Abaca', 'Palm Leaves', 'Banana Fiber',
            'Coconut Coir', 'Seagrass', 'Water Hyacinth', 'Nito Vine', 'Tikog'
        ];

        $colors = [
            'Natural Brown', 'Golden Yellow', 'Deep Red', 'Forest Green',
            'Ocean Blue', 'Earth Orange', 'Cream White', 'Charcoal Black',
            'Sunset Pink', 'Sage Green'
        ];

        // ONLY Cordillera regions
        $originRegions = [
            'Cordillera Administrative Region',
            'Benguet', 'Ifugao', 'Kalinga', 'Apayao', 'Mountain Province', 'Abra'
        ];

        $careInstructions = [
            'Store in a cool, dry place away from direct sunlight',
            'Clean with a soft, damp cloth. Do not use harsh chemicals',
            'Avoid exposure to extreme temperatures and humidity',
            'Hand wash only with mild soap and cold water',
            'Air dry naturally, do not tumble dry',
            'Store flat to maintain shape and prevent creasing',
            'Keep away from sharp objects to prevent damage',
            'Regular dusting with a soft brush recommended'
        ];

        $productName = fake()->words(3, true);
        $price = fake()->randomFloat(2, 150, 8000);
        $weight = fake()->numberBetween(50, 3000);

        return [
            'weaver_id' => Weaver::factory(),
            'name' => $productName,
            'slug' => Str::slug($productName),
            'description' => fake()->paragraphs(3, true),
            'price' => $price,
            'stock_quantity' => fake()->numberBetween(0, 50),
            'category' => fake()->randomElement($categories),
            'tribe' => fake()->randomElement($tribes),
            'technique' => fake()->randomElement($techniques),
            'material' => fake()->randomElement($materials),
            'color' => fake()->randomElement($colors),
            'weight_grams' => $weight,
            'origin_region' => fake()->randomElement($originRegions),
            'is_handmade' => true,
            'tags' => fake()->randomElements(['handmade', 'traditional', 'sustainable', 'artisan', 'local', 'eco-friendly', 'cultural', 'heritage', 'craftsmanship', 'cordillera', 'filipino'], fake()->numberBetween(3, 6)),
            'images' => [
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
            ],
            'main_image' => 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
            'specifications' => [
                'material' => fake()->randomElement($materials),
                'size' => fake()->randomElement(['Small', 'Medium', 'Large', 'Extra Large']),
                'color' => fake()->randomElement($colors),
                'weight' => $weight . 'g',
                'care_level' => fake()->randomElement(['Low', 'Medium', 'High']),
                'suitable_for' => fake()->randomElements(['Indoor', 'Outdoor', 'Kitchen', 'Bathroom', 'Living Room', 'Bedroom'], fake()->numberBetween(1, 3)),
            ],
            'care_instructions' => fake()->randomElements($careInstructions, fake()->numberBetween(3, 6)),
            'dimensions' => [
                'length' => fake()->numberBetween(10, 100) . 'cm',
                'width' => fake()->numberBetween(10, 80) . 'cm',
                'height' => fake()->numberBetween(5, 50) . 'cm',
                'diameter' => fake()->numberBetween(15, 60) . 'cm',
            ],
            'status' => fake()->randomElement(['active', 'active', 'active', 'out_of_stock']),
            'is_featured' => fake()->boolean(15),
            'views_count' => fake()->numberBetween(0, 500),
            'sales_count' => fake()->numberBetween(0, 100),
            'rating' => fake()->randomFloat(2, 3.5, 5.0),
            'reviews_count' => fake()->numberBetween(0, 50),
        ];
    }

    /**
     * Indicate that the product is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
            'rating' => fake()->randomFloat(2, 4.0, 5.0),
            'reviews_count' => fake()->numberBetween(10, 100),
        ]);
    }

    /**
     * Indicate that the product is in stock.
     */
    public function inStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => fake()->numberBetween(1, 50),
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the product is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => 0,
            'status' => 'out_of_stock',
        ]);
    }

    /**
     * Create a basket product.
     */
    public function basket(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'Baskets',
            'technique' => fake()->randomElement(['Coiling', 'Plaiting', 'Twining']),
            'material' => fake()->randomElement(['Rattan', 'Bamboo', 'Abaca', 'Palm Leaves']),
            'price' => fake()->randomFloat(2, 200, 1500),
            'weight_grams' => fake()->numberBetween(200, 800),
        ]);
    }

    /**
     * Create a mat product.
     */
    public function mat(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'Mats',
            'technique' => fake()->randomElement(['Plaiting', 'Weaving']),
            'material' => fake()->randomElement(['Palm Leaves', 'Seagrass', 'Tikog']),
            'price' => fake()->randomFloat(2, 150, 800),
            'weight_grams' => fake()->numberBetween(100, 500),
        ]);
    }

    /**
     * Create a bag product.
     */
    public function bag(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'Bags',
            'technique' => fake()->randomElement(['Weaving', 'Sewing', 'Beading']),
            'material' => fake()->randomElement(['Abaca', 'Banana Fiber', 'Coconut Coir']),
            'price' => fake()->randomFloat(2, 300, 2000),
            'weight_grams' => fake()->numberBetween(150, 600),
        ]);
    }

    /**
     * Create a hat product.
     */
    public function hat(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'Hats',
            'technique' => fake()->randomElement(['Weaving', 'Plaiting']),
            'material' => fake()->randomElement(['Bamboo', 'Palm Leaves', 'Rattan']),
            'price' => fake()->randomFloat(2, 100, 500),
            'weight_grams' => fake()->numberBetween(50, 200),
        ]);
    }
}
