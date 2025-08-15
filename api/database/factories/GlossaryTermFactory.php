<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GlossaryTerm>
 */
class GlossaryTermFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $terms = [
            'Abaca' => 'A type of banana plant whose fiber is used in traditional Filipino weaving.',
            'Banig' => 'A traditional Filipino mat made from woven palm leaves or grass.',
            'Rattan' => 'A climbing palm whose stems are used for weaving furniture and baskets.',
            'T\'nalak' => 'A traditional cloth woven by the T\'boli people from abaca fiber.',
            'Bamboo' => 'A fast-growing grass used in weaving for its strength and flexibility.',
            'Palm Leaves' => 'Leaves from various palm species used in traditional weaving.',
            'Weaving Loom' => 'A device used to hold warp threads in place while weft threads are woven through them.',
            'Warp' => 'The vertical threads in weaving that are held in tension on the loom.',
            'Weft' => 'The horizontal threads that are woven through the warp threads.',
            'Pattern' => 'A decorative design created by the arrangement of woven threads.',
        ];

        $term = fake()->unique()->randomElement(array_keys($terms));
        $definition = $terms[$term];

        $categories = [
            'weaving_technique', 'material', 'tool', 'pattern', 'cultural'
        ];

        return [
            'term' => $term,
            'definition' => $definition,
            'category' => fake()->randomElement($categories),
            'examples' => [
                'This ' . strtolower($term) . ' is commonly used in traditional Filipino crafts.',
                'The artisan carefully selected the ' . strtolower($term) . ' for this project.',
            ],
            'related_terms' => [],
            'image' => null,
            'is_featured' => fake()->boolean(20),
            'views_count' => fake()->numberBetween(0, 500),
            'status' => fake()->randomElement(['draft', 'published', 'published', 'published']),
        ];
    }

    /**
     * Indicate that the term is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
        ]);
    }

    /**
     * Indicate that the term is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
            'status' => 'published',
        ]);
    }
}
