<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Weaver;
use Illuminate\Database\Seeder;

class WeaverSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some featured weavers
        Weaver::factory(3)
            ->featured()
            ->create();

        // Create regular weavers
        Weaver::factory(15)
            ->verified()
            ->create();

        // Create some inactive weavers
        Weaver::factory(5)
            ->state(['status' => 'inactive'])
            ->create();
    }
}
