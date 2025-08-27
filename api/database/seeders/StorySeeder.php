<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Story;
use App\Models\Weaver;

class StorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $weavers = Weaver::all();

        if ($weavers->isEmpty()) {
            $this->command->warn('No weavers found. Please run WeaverSeeder first.');
            return;
        }

        $stories = [
            [
                'weaver_id' => $weavers->first()->id,
                'title' => 'The Art of Traditional Weaving: A Journey Through Time',
                'type' => 'photo_essay',
                'content' => 'Traditional Filipino weaving is more than just a craft—it is a living testament to our rich cultural heritage. For generations, skilled artisans have passed down their knowledge, creating intricate patterns that tell stories of our ancestors and their connection to the land.

Each piece of handwoven fabric carries with it the spirit of the weaver, the history of their community, and the traditions that have shaped Filipino culture for centuries. From the vibrant colors of Mindanao to the subtle earth tones of the Cordilleras, every region has its own unique weaving tradition that reflects the local environment and cultural practices.

The process of creating these beautiful textiles is both an art and a science. It begins with the careful selection of materials—natural fibers like abaca, cotton, and silk that are harvested and prepared with respect for the environment. The dyes used are often derived from local plants and minerals, creating colors that are not only beautiful but also sustainable.

As the weaver works at their loom, they are not just creating fabric—they are preserving a way of life. Each thread is carefully placed, each pattern carefully planned, to create a piece that will be treasured for generations to come.',
                'blocks' => [
                    [
                        'type' => 'heading',
                        'content' => 'The Materials'
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Traditional weavers use a variety of natural materials, each chosen for its unique properties and cultural significance.'
                    ],
                    [
                        'type' => 'image',
                        'url' => '/placeholder-story.jpg',
                        'caption' => 'Natural fibers being prepared for weaving'
                    ],
                    [
                        'type' => 'heading',
                        'content' => 'The Process'
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'From preparation to completion, the weaving process requires patience, skill, and a deep understanding of the craft.'
                    ],
                    [
                        'type' => 'quote',
                        'content' => 'Weaving is not just about creating beautiful fabric—it is about preserving our culture and passing it on to future generations.'
                    ]
                ],
                'featured_image' => '/placeholder-story.jpg',
                'images' => ['/placeholder-story.jpg', '/placeholder-story.jpg'],
                'status' => 'published',
                'is_featured' => true,
                'tags' => ['traditional', 'weaving', 'culture', 'heritage'],
                'language_tags' => ['en', 'fil'],
                'published_at' => now(),
            ],
            [
                'weaver_id' => $weavers->first()->id,
                'title' => 'Maria Santos: A Weaver\'s Life Story',
                'type' => 'oral_history',
                'content' => 'Maria Santos learned the art of weaving from her grandmother when she was just eight years old. Growing up in a small village in Mindanao, she spent countless hours watching her grandmother work at the loom, absorbing every detail of the craft.

"I remember sitting by her side, watching her hands move so quickly and gracefully," Maria recalls. "She would tell me stories about our ancestors and how they used weaving to communicate with each other and with the spirits."

For Maria, weaving is not just a way to make a living—it is a connection to her past and a way to honor her grandmother\'s memory. Each piece she creates carries with it the love and wisdom passed down through generations.

"The patterns I use are the same ones my grandmother taught me," she explains. "When I weave, I feel her presence with me, guiding my hands and helping me create something beautiful."',
                'blocks' => [
                    [
                        'type' => 'heading',
                        'content' => 'Early Years'
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Maria\'s journey into weaving began in her grandmother\'s humble home, where the sound of the loom was a constant presence.'
                    ],
                    [
                        'type' => 'quote',
                        'content' => 'My grandmother always said that weaving is like telling a story with your hands.'
                    ],
                    [
                        'type' => 'heading',
                        'content' => 'The Legacy'
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Today, Maria continues her grandmother\'s legacy, teaching young people in her community the art of traditional weaving.'
                    ]
                ],
                'featured_image' => '/placeholder-story.jpg',
                'images' => ['/placeholder-story.jpg'],
                'status' => 'published',
                'is_featured' => false,
                'tags' => ['oral_history', 'family', 'tradition', 'legacy'],
                'language_tags' => ['en', 'fil'],
                'published_at' => now(),
            ],
            [
                'weaver_id' => $weavers->first()->id,
                'title' => 'The Evolution of Filipino Weaving: A Timeline',
                'type' => 'timeline',
                'content' => 'The history of Filipino weaving spans thousands of years, from the earliest settlers to the present day. This timeline traces the development of this ancient craft and its significance in Filipino culture.

Pre-colonial Period (Before 1521)
The earliest evidence of weaving in the Philippines dates back to the pre-colonial period. Indigenous communities used natural fibers to create clothing, household items, and ceremonial objects. Each region developed its own unique styles and techniques.

Spanish Colonial Period (1521-1898)
The arrival of the Spanish brought new materials and techniques to Filipino weaving. Silk and cotton became more widely available, and new patterns and designs were introduced. However, traditional methods were preserved in many rural areas.

American Colonial Period (1898-1946)
During the American period, there was a renewed interest in traditional crafts. The government established schools and programs to preserve and promote Filipino weaving traditions.

Post-Independence (1946-Present)
Today, Filipino weaving continues to evolve while maintaining its traditional roots. Modern weavers combine ancient techniques with contemporary designs, creating pieces that honor the past while embracing the future.',
                'blocks' => [
                    [
                        'type' => 'heading',
                        'content' => 'Pre-colonial Period'
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'The foundation of Filipino weaving was established during this period, with each region developing unique traditions.'
                    ],
                    [
                        'type' => 'heading',
                        'content' => 'Spanish Influence'
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'New materials and techniques were introduced, but traditional methods were preserved in rural communities.'
                    ],
                    [
                        'type' => 'heading',
                        'content' => 'Modern Era'
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Contemporary weavers continue to innovate while honoring traditional techniques and cultural significance.'
                    ]
                ],
                'featured_image' => '/placeholder-story.jpg',
                'images' => ['/placeholder-story.jpg', '/placeholder-story.jpg', '/placeholder-story.jpg'],
                'status' => 'published',
                'is_featured' => false,
                'tags' => ['history', 'timeline', 'evolution', 'culture'],
                'language_tags' => ['en'],
                'published_at' => now(),
            ],
            [
                'weaver_id' => $weavers->first()->id,
                'title' => 'Weaving Communities Across the Philippines',
                'type' => 'map',
                'content' => 'The Philippines is home to diverse weaving communities, each with its own unique traditions and techniques. From the northern mountains to the southern islands, weaving has been an integral part of Filipino culture for generations.

In the Cordillera region, the Ifugao people are known for their intricate backstrap weaving, creating textiles that are both functional and symbolic. Their designs often feature geometric patterns that represent their connection to the natural world.

In Mindanao, the T\'boli people are famous for their t\'nalak cloth, made from abaca fibers and dyed with natural materials. Each piece tells a story, with patterns that reflect the weaver\'s dreams and spiritual experiences.

The Visayas region is home to the hablon tradition, where weavers create lightweight, colorful fabrics perfect for the tropical climate. These textiles are often used for traditional clothing and household items.',
                'blocks' => [
                    [
                        'type' => 'heading',
                        'content' => 'Northern Philippines'
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'The Cordillera region is known for its backstrap weaving and intricate geometric patterns.'
                    ],
                    [
                        'type' => 'heading',
                        'content' => 'Southern Philippines'
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Mindanao is home to the T\'boli people and their famous t\'nalak cloth.'
                    ],
                    [
                        'type' => 'heading',
                        'content' => 'Central Philippines'
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'The Visayas region features the hablon tradition, creating lightweight, colorful fabrics.'
                    ]
                ],
                'featured_image' => '/placeholder-story.jpg',
                'images' => ['/placeholder-story.jpg', '/placeholder-story.jpg'],
                'status' => 'published',
                'is_featured' => false,
                'tags' => ['geography', 'communities', 'regions', 'diversity'],
                'language_tags' => ['en', 'fil'],
                'published_at' => now(),
            ],
        ];

        foreach ($stories as $storyData) {
            Story::create($storyData);
        }

        $this->command->info('Stories seeded successfully!');
    }
}
