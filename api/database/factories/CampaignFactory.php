<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Campaign>
 */
class CampaignFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tags = [
            'weaving', 'artisan', 'community', 'sustainability', 'heritage',
            'education', 'preservation', 'empowerment', 'culture'
        ];

        return [
            'title' => fake()->sentence(),
            'description' => fake()->paragraphs(3, true),
            'slug' => fake()->slug(),
            'featured_image' => null,
            'images' => [],
            'goal_amount' => fake()->numberBetween(50000, 500000),
            'current_amount' => fake()->numberBetween(0, 100000),
            'donors_count' => fake()->numberBetween(0, 50),
            'status' => fake()->randomElement(['draft', 'active', 'active', 'completed']),
            'is_featured' => fake()->boolean(15),
            'start_date' => fake()->dateTimeBetween('-6 months', 'now'),
            'end_date' => fake()->dateTimeBetween('now', '+6 months'),
            'tags' => fake()->randomElements($tags, fake()->numberBetween(2, 4)),
            'views_count' => fake()->numberBetween(0, 2000),
        ];
    }

    /**
     * Indicate that the campaign is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'start_date' => fake()->dateTimeBetween('-3 months', 'now'),
            'end_date' => fake()->dateTimeBetween('now', '+3 months'),
        ]);
    }

    /**
     * Indicate that the campaign is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
            'status' => 'active',
        ]);
    }
}
