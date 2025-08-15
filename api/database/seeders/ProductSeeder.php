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
            $weavers = Weaver::factory(5)->verified()->create();
        }

        // Create products for each weaver
        foreach ($weavers as $weaver) {
            // Create 2-5 products per weaver
            $productCount = rand(2, 5);
            
            Product::factory($productCount)
                ->state(['weaver_id' => $weaver->id])
                ->create();

            // Create 1 featured product per weaver
            Product::factory()
                ->featured()
                ->state(['weaver_id' => $weaver->id])
                ->create();
        }

        // Create some out-of-stock products
        Product::factory(10)
            ->state(['stock_quantity' => 0, 'status' => 'out_of_stock'])
            ->create();
    }
}
