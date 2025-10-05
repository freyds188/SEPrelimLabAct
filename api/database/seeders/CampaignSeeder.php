<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Campaign;

class CampaignSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create the main "General Support" campaign
        Campaign::create([
            'title' => 'General Support',
            'description' => 'Support our artisans and preserve traditional Cordillera weaving techniques. Your donations help provide materials, training, and equipment to our weaving communities.',
            'slug' => 'general-support',
            'featured_image' => null,
            'images' => [],
            'goal_amount' => 1000000, // ₱1,000,000 goal
            'current_amount' => 500000, // Start with ₱500,000
            'donors_count' => 0,
            'status' => 'active',
            'is_featured' => true,
            'start_date' => now(),
            'end_date' => now()->addYear(), // 1 year from now
            'tags' => ['general', 'support', 'artisans', 'weaving'],
            'views_count' => 0,
        ]);

        // Create additional sample campaigns
        Campaign::create([
            'title' => 'Weaving Materials Fund',
            'description' => 'Help provide high-quality materials for traditional weaving projects.',
            'slug' => 'weaving-materials-fund',
            'featured_image' => null,
            'images' => [],
            'goal_amount' => 200000,
            'current_amount' => 75000,
            'donors_count' => 0,
            'status' => 'active',
            'is_featured' => false,
            'start_date' => now(),
            'end_date' => now()->addMonths(6),
            'tags' => ['materials', 'weaving', 'supplies'],
            'views_count' => 0,
        ]);

        Campaign::create([
            'title' => 'Artisan Training Program',
            'description' => 'Support training programs for new weavers to learn traditional techniques.',
            'slug' => 'artisan-training-program',
            'featured_image' => null,
            'images' => [],
            'goal_amount' => 300000,
            'current_amount' => 120000,
            'donors_count' => 0,
            'status' => 'active',
            'is_featured' => false,
            'start_date' => now(),
            'end_date' => now()->addMonths(8),
            'tags' => ['training', 'education', 'artisans'],
            'views_count' => 0,
        ]);
    }
}

