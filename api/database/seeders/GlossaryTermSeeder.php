<?php

namespace Database\Seeders;

use App\Models\GlossaryTerm;
use Illuminate\Database\Seeder;

class GlossaryTermSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create featured glossary terms
        GlossaryTerm::factory(3)
            ->featured()
            ->create();

        // Create regular glossary terms
        GlossaryTerm::factory(5)
            ->published()
            ->create();

        // Create some draft terms
        GlossaryTerm::factory(2)
            ->state(['status' => 'draft'])
            ->create();
    }
}
