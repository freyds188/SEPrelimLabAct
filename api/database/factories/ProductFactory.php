<?php

namespace Database\Factories;

use App\Models\Weaver;
use Illuminate\Database\Eloquent\Factories\Factory;

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

        $tags = [
            'handmade', 'traditional', 'sustainable', 'artisan', 'local',
            'eco-friendly', 'cultural', 'heritage', 'craftsmanship'
        ];

        return [
            'weaver_id' => Weaver::factory(),
            'name' => fake()->words(3, true),
            'description' => fake()->paragraphs(2, true),
            'price' => fake()->randomFloat(2, 100, 5000),
            'stock_quantity' => fake()->numberBetween(0, 50),
            'category' => fake()->randomElement($categories),
            'tags' => fake()->randomElements($tags, fake()->numberBetween(2, 5)),
            'images' => [],
            'main_image' => null,
            'specifications' => [
                'material' => fake()->randomElement(['Rattan', 'Bamboo', 'Abaca', 'Palm Leaves', 'Banana Fiber']),
                'size' => fake()->randomElement(['Small', 'Medium', 'Large', 'Extra Large']),
                'color' => fake()->colorName(),
                'weight' => fake()->numberBetween(100, 2000) . 'g',
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
}
