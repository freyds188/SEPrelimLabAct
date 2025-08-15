<?php

namespace Database\Factories;

use App\Models\Weaver;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Story>
 */
class StoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tags = [
            'weaving', 'tradition', 'culture', 'heritage', 'artisan',
            'handmade', 'community', 'sustainability', 'craftsmanship'
        ];

        return [
            'weaver_id' => Weaver::factory(),
            'title' => fake()->sentence(),
            'content' => fake()->paragraphs(3, true),
            'slug' => fake()->slug(),
            'featured_image' => null,
            'images' => [],
            'status' => fake()->randomElement(['draft', 'published', 'published', 'published']),
            'is_featured' => fake()->boolean(10),
            'views_count' => fake()->numberBetween(0, 1000),
            'likes_count' => fake()->numberBetween(0, 100),
            'tags' => fake()->randomElements($tags, fake()->numberBetween(2, 4)),
            'published_at' => fake()->optional()->dateTimeBetween('-1 year', 'now'),
        ];
    }

    /**
     * Indicate that the story is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => fake()->dateTimeBetween('-1 year', 'now'),
        ]);
    }

    /**
     * Indicate that the story is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
            'status' => 'published',
            'published_at' => fake()->dateTimeBetween('-1 year', 'now'),
        ]);
    }
}
