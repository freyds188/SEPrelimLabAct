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
        GlossaryTerm::factory(5)
            ->featured()
            ->create();

        // Create regular glossary terms
        GlossaryTerm::factory(20)
            ->published()
            ->create();

        // Create some draft terms
        GlossaryTerm::factory(5)
            ->state(['status' => 'draft'])
            ->create();
    }
}
