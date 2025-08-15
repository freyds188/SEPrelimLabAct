<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Weaver>
 */
class WeaverFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $skills = [
            'Traditional Weaving', 'Basket Weaving', 'Textile Weaving', 
            'Rattan Weaving', 'Bamboo Weaving', 'Palm Leaf Weaving',
            'Abaca Weaving', 'Banig Weaving', 'T\'nalak Weaving'
        ];

        $specialties = [
            'Baskets', 'Mats', 'Bags', 'Hats', 'Decorative Items',
            'Furniture', 'Textiles', 'Accessories', 'Home Decor'
        ];

        $locations = [
            'Bohol', 'Cebu', 'Davao', 'Palawan', 'Mindanao',
            'Luzon', 'Visayas', 'Manila', 'Quezon City'
        ];

        return [
            'user_id' => User::factory(),
            'name' => fake()->name(),
            'bio' => fake()->paragraph(3),
            'location' => fake()->randomElement($locations),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->unique()->safeEmail(),
            'profile_image' => null,
            'skills' => fake()->randomElements($skills, fake()->numberBetween(2, 4)),
            'specialties' => fake()->randomElements($specialties, fake()->numberBetween(1, 3)),
            'experience_years' => fake()->numberBetween(1, 30),
            'story' => fake()->paragraphs(2, true),
            'rating' => fake()->randomFloat(2, 3.5, 5.0),
            'total_orders' => fake()->numberBetween(0, 100),
            'is_featured' => fake()->boolean(20),
            'is_verified' => fake()->boolean(80),
            'status' => fake()->randomElement(['active', 'active', 'active', 'inactive']),
        ];
    }

    /**
     * Indicate that the weaver is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
            'is_verified' => true,
            'rating' => fake()->randomFloat(2, 4.0, 5.0),
        ]);
    }

    /**
     * Indicate that the weaver is verified.
     */
    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_verified' => true,
        ]);
    }
}
