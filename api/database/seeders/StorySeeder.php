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

        // Update the weaver name to CordiWeave
        $weaver = $weavers->first();
        $weaver->update(['name' => 'CordiWeave']);

        $stories = [
            [
                'weaver_id' => $weaver->id,
                'title' => 'Eliza Chawi: Manay – The Oldest Kankanaey Weaver',
                'type' => 'photo_essay',
                'content' => 'Eliza "Manay" Chawi is celebrated as one of the living treasures of the Kankanaey community in Sagada, a tranquil mountain town cradled by the misty peaks of the Cordillera region in the northern Philippines. Now surpassing ninety years of age, Manay has devoted nearly her entire life to the art of weaving on the backstrap loom, a craft that has become a vital thread in preserving the rich tapestry of her people\'s culture, values, and identity. Her hands, etched with the lines of decades spent at the loom, tell a story of endurance, while her eyes—bright with the wisdom of a tradition spanning generations—reflect a deep connection to her heritage. Her modest home, perched on a hillside overlooking the limestone cliffs of Sagada, is adorned with drying herbs, handwoven textiles, and the faint scent of pine, serving as both her sanctuary and a living museum of Kankanaey artistry.

Manay\'s weaving journey began in her childhood, a time when the world moved at the pace of the seasons. She learned the intricate techniques from her mother, stealing moments between grueling farm duties under the golden light of dawn or the soft glow of kerosene lamps at night. The backstrap loom, a simple yet ingenious device strapped to her waist and anchored to a post or tree, became her companion as she mastered the art of interlacing threads with precision. She recalls the rhythmic creak of the wooden frame, the gentle tug of the strap against her back, and the soothing hum of her mother\'s voice as she shared stories of their ancestors. For Manay, weaving was never merely about producing cloth; it was a sacred act of storytelling, a way to weave the resilience of her community, the sacredness of their ancestral rituals, and the enduring bond with the land into every fabric she created. Each thread was a brushstroke on a canvas of memory, dyed with natural hues extracted from indigo plants, wild berries, and tree bark gathered from the surrounding forests.

Among her most cherished creations are the "inabel" blankets and "wanes," the traditional loincloth worn by Kankanaey men during ceremonies and daily life. These textiles are masterpieces of craftsmanship, featuring an array of intricate patterns—diamonds, zigzags, stripes, and even subtle floral motifs—each imbued with profound meaning in Kankanaey cosmology. The diamond shapes evoke the rugged mountains that have sheltered her people for centuries, their peaks a constant presence in Sagada\'s skyline. Zigzags mirror the winding rivers that carve through the valleys, nourishing their crops and sustaining life. Stripes, she explains with a smile, are prayers woven into the fabric, seeking fertility for the fields and protection from malevolent spirits believed to linger in the highlands. Despite the frailty that comes with her advanced age, Manay still weaves daily, her movements slow but deliberate, guided by muscle memory and an unyielding passion. She works in the early morning hours, when the air is cool and the silence of the mountains is broken only by the distant crow of a rooster, her weathered hands moving with a grace that belies her years.

Through her work, Manay has become a beacon of cultural preservation, mentoring younger generations with the patience of a seasoned teacher. She gathers apprentices—young women and men eager to learn—around her loom, sharing tales of her youth, the hardships of wartime, and the joy of communal harvests. "Without weaving," she says with a gentle yet firm voice, "we lose the memory of who we are. It is our history, our heartbeat, our connection to those who came before us." Her legacy extends beyond her own hands, as she trains apprentices to carry forward the Kankanaey tradition, teaching them to source natural dyes, maintain the looms, and interpret the symbolic patterns. Manay\'s influence reaches beyond Sagada, with her textiles featured in cultural exhibitions and admired by visitors who trek to her home to witness her craft. She is living proof that woven threads are stronger than time, a testament to the enduring spirit of her people and a bridge between the past and a future where her legacy will continue to thrive.',
                'blocks' => [
                    [
                        'type' => 'heading',
                        'content' => 'The Living Treasure'
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Eliza "Manay" Chawi is celebrated as one of the living treasures of the Kankanaey community in Sagada, a tranquil mountain town cradled by the misty peaks of the Cordillera region.'
                    ],
                    [
                        'type' => 'quote',
                        'content' => 'Without weaving, we lose the memory of who we are. It is our history, our heartbeat, our connection to those who came before us.'
                    ],
                    [
                        'type' => 'heading',
                        'content' => 'Sacred Patterns'
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'The diamond shapes evoke the rugged mountains, zigzags mirror the winding rivers, and stripes are prayers woven into the fabric.'
                    ]
                ],
                'featured_image' => '/images/stories/ElizaChawi.jpg',
                'images' => ['/images/stories/ElizaChawi.jpg', '/images/stories/ElizaChawi.jpg'],
                'status' => 'published',
                'is_featured' => true,
                'tags' => ['kankanaey', 'sagada', 'backstrap_loom', 'inabel', 'traditional_patterns'],
                'language_tags' => ['en', 'fil'],
                'published_at' => now(),
            ],
            [
                'weaver_id' => $weaver->id,
                'title' => 'Warp and Weft: Weaving as Story',
                'type' => 'oral_history',
                'content' => 'In the rugged highlands of the Cordillera, weaving is revered as an art form akin to storytelling, a cultural practice that weaves the past into the present with every careful thread. The warp threads—the vertical lines stretched tightly across the backstrap loom—serve as the foundation of the fabric, mirroring the lineage of ancestors that binds the community together across generations, their names and deeds etched into the collective memory. The weft—the horizontal threads interlaced through the warp—represents the everyday experiences, struggles, triumphs, joys, and sorrows of the people, creating a tapestry that tells their unbroken story. This metaphor is deeply woven into the oral traditions of the Cordillera, where weaving sessions were once vibrant communal gatherings, especially among women, serving as both a creative and social ritual.

These gatherings took place in open spaces beneath the shade of ancient trees or within the warm, smoky interiors of communal huts, where the rhythmic clacking of looms filled the air with a symphony of tradition. Women would sit together, their hands moving in unison as they exchanged stories that ranged from myths about ancestral spirits guarding the mountains to practical lessons about planting rice in the terraces and heartfelt songs about courtship, love, and the longing for distant relatives. These sessions were more than opportunities to produce textiles; they were living archives of oral tradition, preserving the wisdom, humor, and identity of the Cordillera people. The act of weaving became a collaborative effort, with each participant contributing not only their skill but also their voice, ensuring that the stories—often accompanied by laughter or the occasional tear—were passed down intact to the next generation.

One particularly striking oral history revolves around the "binakol" pattern, known for its dizzying, whirlpool-like design that seems to swirl with an almost mystical energy. Elders recount that this pattern was woven with the intention of warding off evil spirits, a protective charm for the wearer against the unseen forces believed to inhabit the misty peaks and dense forests of the region. They tell of a time when a village elder dreamed of a spiraling vortex that saved her people from a plague, inspiring the creation of the binakol as a talisman of safety. Another significant design is the "kain," or snake pattern, its sinuous lines mimicking the movement of serpents revered in local folklore as guardians of fertility and continuity of life. These designs are far from random decorations; they are encoded wisdom, serving as visual lessons for younger generations about resilience, protection, and the unity that holds their communities together, even in the face of external pressures.

In today\'s context, while some of these oral traditions are fading due to the encroachment of modernization—televisions replacing storytelling circles and schools prioritizing academic subjects over cultural arts—the woven textiles remain as tangible reminders of the past. Each blanket or garment serves as a chapter in the ongoing narrative of the Cordillera people, a silent testament to their heritage that speaks louder than words. To read a textile is to listen to the voices of the ancestors, to hear the echoes of their laughter during harvest feasts, their struggles during colonial oppression, and their hopes for a future where their traditions endure. As the region continues to evolve, with young people migrating to cities and new technologies reshaping daily life, the art of weaving stands as a bridge between generations, ensuring that the stories woven into every thread will not be lost to the relentless march of time.',
                'blocks' => [
                    [
                        'type' => 'heading',
                        'content' => 'Weaving as Storytelling'
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'The warp threads mirror the lineage of ancestors, while the weft represents everyday experiences, creating a tapestry that tells their unbroken story.'
                    ],
                    [
                        'type' => 'quote',
                        'content' => 'To read a textile is to listen to the voices of the ancestors, to hear the echoes of their laughter during harvest feasts.'
                    ],
                    [
                        'type' => 'heading',
                        'content' => 'Sacred Patterns'
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'The "binakol" pattern wards off evil spirits, while the "kain" snake pattern represents fertility and continuity of life.'
                    ]
                ],
                'featured_image' => '/images/stories/WarpandWeft.jpg',
                'images' => ['/images/stories/WarpandWeft.jpg', '/images/stories/WarpandWeft.jpg'],
                'status' => 'published',
                'is_featured' => true,
                'tags' => ['cordillera', 'oral_tradition', 'binakol', 'kain_pattern', 'cultural_preservation'],
                'language_tags' => ['en', 'fil'],
                'published_at' => now(),
            ],
            [
                'weaver_id' => $weaver->id,
                'title' => 'Pasiking: The Traditional Igorot Backpack',
                'type' => 'photo_essay',
                'content' => 'The Pasiking, a traditional rattan backpack crafted by the Igorot people of the Cordillera, stands as one of the most iconic symbols of their rich and enduring heritage. Handmade using durable materials such as bamboo, rattan, and wood sourced from the region\'s dense forests, the pasiking is far more than a simple container; it is a carrier of history, identity, and spirituality, embodying the ingenuity, resourcefulness, and deep connection to the land that define the Igorot way of life. Its sturdy frame, often reinforced with wooden slats, and intricately woven body reflect a masterful balance of practicality and artistry, a testament to the skill passed down through generations in the shadow of the Cordillera\'s towering peaks.

Historically, the pasiking was an indispensable tool for men, used to carry heavy loads of food, tools, or hunting gear during long treks through the steep and rugged terrain that characterizes the region. These journeys could last days, with men navigating narrow trails and crossing rushing rivers, the pasiking strapped securely to their backs with woven straps. Yet, its significance extends beyond practicality into the spiritual realm. In many communities, the pasiking also served as a ritual object, imbued with sacred meaning. Certain types, such as the inabnutan, were considered vessels for ancestral spirits and were kept in designated spaces within the home or village—often a corner adorned with offerings of rice or tobacco—believed to watch over the household and protect its members from harm, illness, or misfortune. The crafting process itself was a meticulous endeavor, with artisans harvesting rattan during the dry season, soaking it to make it pliable, and weaving each strip with care to create a structure that was both strong and flexible, capable of withstanding the demands of mountain life.

In modern times, the pasiking has transcended its utilitarian roots to become a cultural emblem for Igorot youth, a symbol of pride worn during festivals like the Lang-ay Festival, cultural parades, and even in innovative fashion adaptations that blend tradition with contemporary style. Designers have incorporated pasiking-inspired patterns into clothing and accessories, showcasing the craft on international stages. Despite these modern uses, the process of making a pasiking remains faithful to ancient techniques, with artisans continuing to harvest rattan from sustainable forest patches, a practice guided by community rules to preserve the ecosystem. Each strip is painstakingly measured, bent, and woven by hand, often accompanied by songs or prayers, ensuring that the finished product tells a story of continuity and pride.

Beyond its physical utility, the pasiking reflects the Cordillera philosophy of resilience, a worldview shaped by the challenges of mountain living. Just as the bag can carry heavy loads across long, arduous treks—whether laden with rice sacks or the weight of a hunter\'s quarry—so too do the Igorot people endure the challenges of life, from natural disasters to cultural pressures, while carrying the weight of their heritage with unwavering pride. This enduring symbol serves as a reminder of their strength and adaptability, a legacy that continues to inspire both within the Cordillera and beyond, as young Igorot weave new stories into the fabric of their future while honoring the past.',
                'blocks' => [
                    [
                        'type' => 'heading',
                        'content' => 'The Iconic Symbol'
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'The Pasiking is far more than a simple container; it is a carrier of history, identity, and spirituality, embodying the ingenuity of the Igorot people.'
                    ],
                    [
                        'type' => 'quote',
                        'content' => 'The pasiking reflects the Cordillera philosophy of resilience, a worldview shaped by the challenges of mountain living.'
                    ],
                    [
                        'type' => 'heading',
                        'content' => 'Sacred Meaning'
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Certain types, such as the inabnutan, were considered vessels for ancestral spirits and were kept in designated spaces within the home.'
                    ]
                ],
                'featured_image' => '/images/stories/Pasiking.jpg',
                'images' => ['/images/stories/Pasiking.jpg', '/images/stories/Pasiking.jpg'],
                'status' => 'published',
                'is_featured' => false,
                'tags' => ['igorot', 'pasiking', 'rattan', 'traditional_backpack', 'cultural_heritage'],
                'language_tags' => ['en', 'fil'],
                'published_at' => now(),
            ],
            [
                'weaver_id' => $weaver->id,
                'title' => 'CordiTex: Weaving the Past to the Future',
                'type' => 'timeline',
                'content' => 'The story of Cordillera weaving is a dynamic timeline of resilience, adaptation, and cultural pride that spans centuries, reflecting the enduring spirit of the region\'s people amidst a constantly changing world.

Pre-colonial Era: Long before foreign influences reached the isolated highlands of the Cordillera, backstrap looms were already in widespread use across the region, their portability allowing weavers to work in fields or homes. Textiles played a central role in society, serving as markers of social class, identity, and spiritual significance. Chiefs and elders wore elaborately patterned garments reserved for rituals, their vibrant designs woven with natural dyes extracted from indigo plants, wild berries, and the bark of trees like the narra. These textiles were not just garments but sacred artifacts, used in ceremonies to honor ancestors, seek blessings from the spirits, and mark significant life events such as births, marriages, and deaths, their patterns whispered about in the glow of communal fires.

Spanish Colonization (1500s–1800s): The arrival of Spanish colonizers brought attempts to impose foreign culture, religion, and governance, but the Cordillera people resisted assimilation with fierce determination. Retreating to the mountains, they preserved their traditions, with weaving continuing to flourish as a symbol of defiance and identity. The backstrap loom remained a cornerstone of household life, its simplicity allowing it to be hidden from colonial authorities during raids. Women wove in secret, passing down techniques and stories of resistance, while men used woven textiles to barter with neighboring tribes, strengthening alliances against the invaders.

American Period (1900s): The introduction of Western education and new tools during the American occupation brought significant changes to the region, including the availability of synthetic fabrics and sewing machines. However, the backstrap weaving tradition remained a strong household practice, deeply ingrained in the daily lives of Cordillera families. Some weavers began to experiment with blending traditional patterns—such as the ikat and binakol—with modern designs, creating a fusion that reflected both heritage and innovation. Missionaries documented these practices, unknowingly preserving them for posterity, while schools introduced weaving as a vocational skill, ensuring its survival amid rapid modernization.

1970s–1980s: A surge of cultural awareness swept across the Philippines during this period, spurred by the fight against martial law and a growing pride in indigenous heritage. This brought renewed recognition to the art of weaving in the Cordillera, with local organizations and cooperatives formed to support weavers by providing markets, resources, and training. Elders were invited to share their knowledge at workshops, where young weavers learned to source natural dyes and maintain looms. This era marked a revival of interest in traditional crafts, with efforts to document patterns and techniques that had been at risk of being forgotten, supported by government initiatives and international NGOs.

2000s–Present: In recent decades, Cordillera textiles have gained international acclaim, entering global fashion markets as young designers reinterpret traditional fabrics into modern clothing lines, handbags, and home decor. High-end fashion shows in Manila, New York, and Paris now feature Cordillera-inspired designs, their bold patterns and earthy tones captivating audiences worldwide. Yet, elders emphasize the importance of preserving authentic techniques, mentoring the next generation to ensure that the soul of the craft remains intact. Weaving cooperatives have expanded, offering fair trade opportunities, while cultural festivals showcase live demonstrations, drawing tourists and scholars alike. From ancient rituals to contemporary runways, CordiTex stands as proof that woven traditions can bridge the past to the future, evolving with each generation while staying rooted in its cultural origins.',
                'blocks' => [
                    [
                        'type' => 'heading',
                        'content' => 'Pre-colonial Era'
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Backstrap looms were already in widespread use, with textiles serving as markers of social class, identity, and spiritual significance.'
                    ],
                    [
                        'type' => 'heading',
                        'content' => 'Spanish Colonization'
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'The Cordillera people resisted assimilation, preserving traditions with weaving flourishing as a symbol of defiance and identity.'
                    ],
                    [
                        'type' => 'heading',
                        'content' => 'Modern Era'
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Cordillera textiles have gained international acclaim, entering global fashion markets while preserving authentic techniques.'
                    ]
                ],
                'featured_image' => '/images/stories/Corditex.jpg',
                'images' => ['/images/stories/Corditex.jpg', '/images/stories/Corditex.jpg'],
                'status' => 'published',
                'is_featured' => false,
                'tags' => ['cordillera', 'weaving_history', 'cultural_evolution', 'traditional_crafts', 'modern_adaptation'],
                'language_tags' => ['en', 'fil'],
                'published_at' => now(),
            ],
            [
                'weaver_id' => $weaver->id,
                'title' => 'Community Tapestry: Weaving as Social Fabric',
                'type' => 'map',
                'content' => 'In the Cordillera region, weaving is far more than an individual craft—it is a communal practice that binds villages together, creating a rich tapestry of cultural connections that have shaped the region\'s identity for centuries. Mapping the weaving communities reveals a network of shared traditions, trade routes, and relationships that weave a story of unity across the rugged landscape, from the terraced slopes of Ifugao to the pine-clad hills of Benguet.

Bontoc and Mountain Province: This area is renowned for the pangablan cloth and the ikat technique, where threads are tied and dyed before weaving to create intricate, blurred patterns. Weaving here reflects both the daily life of the community—women crafting "wanes" for men\'s wear—and the sacred rituals performed to honor ancestors, with textiles often used in ceremonies and as markers of social status. The annual Lang-ay Festival sees weavers showcasing their skills, their looms set up in village squares as crowds gather to admire the vibrant fabrics.

Ifugao: The weaving traditions of Ifugao are deeply tied to their agricultural heritage, particularly the iconic rice terraces that cascade down the mountainsides. Textiles here are often crafted for rituals celebrating the rice harvest, their designs—featuring motifs of rice stalks and water—echoing the terraced landscapes and symbolizing abundance and gratitude to the land. Weavers work in groups during the off-season, their songs filling the air as they prepare for the annual harvest festival, where new textiles are blessed by village elders.

Kankanaey (Sagada and Benguet): The Kankanaey people are recognized for their bold geometric patterns and blankets, which play significant roles in weddings, burials, and other life events. These textiles are imbued with meaning, serving as both practical items—keeping families warm in the chilly highlands—and spiritual protections, with certain patterns believed to ward off evil spirits. In Sagada, weaving is a family affair, with mothers teaching daughters the art while fathers carve the wooden loom frames, a tradition reinforced during community gatherings.

Ibaloi: Known for their soft woven blankets, the Ibaloi use weaving to symbolize warmth and kinship. These blankets are often gifted during significant occasions—births, weddings, and funerals—reinforcing social bonds and ensuring that the community remains tightly knit. The Ibaloi weave in the evenings, their looms illuminated by firelight, as they share tales of past heroes and the spirits that guide their lives, a practice that strengthens their cultural fabric.

Abra and Ilocos (Neighboring Regions): While not always considered part of the Cordillera, these areas have historically influenced weaving through trade routes and cultural exchanges. Their weaving practices—featuring simpler patterns—contributed to a broader network that strengthened the region\'s textile economy, with merchants traveling mountain paths to barter textiles for salt, tools, and livestock. These exchanges fostered intermarriages and shared festivals, weaving a web of relationships that enriched the Cordillera\'s cultural tapestry.

Each point on this cultural map illustrates that weaving was never an isolated endeavor. Threads traveled across communities, carried by traders, brides in arranged marriages, and storytellers, along with the narratives, songs, and wisdom they shared. The map of Cordillera weaving is thus also a map of relationships, a visual representation of how the craft stitches people together across generations and geographies. Weaving is social fabric in the truest sense: it does not only cover the body but also connects families, villages, and the greater Cordillera identity, ensuring that each woven cloth is both a product of one community and a contribution to the region\'s collective heritage, a legacy that endures through the laughter of children learning at their mothers\' looms and the prayers offered at ancestral altars.',
                'blocks' => [
                    [
                        'type' => 'heading',
                        'content' => 'Bontoc and Mountain Province'
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Renowned for the pangablan cloth and the ikat technique, with weaving reflecting both daily life and sacred rituals.'
                    ],
                    [
                        'type' => 'heading',
                        'content' => 'Ifugao'
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Weaving traditions deeply tied to agricultural heritage, particularly the iconic rice terraces.'
                    ],
                    [
                        'type' => 'heading',
                        'content' => 'Kankanaey'
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Recognized for bold geometric patterns and blankets that play significant roles in life events.'
                    ]
                ],
                'featured_image' => '/images/stories/CommunityTapestry.jpg',
                'images' => ['/images/stories/CommunityTapestry.jpg', '/images/stories/CommunityTapestry.jpg'],
                'status' => 'published',
                'is_featured' => false,
                'tags' => ['cordillera', 'community_weaving', 'cultural_connections', 'trade_routes', 'social_fabric'],
                'language_tags' => ['en', 'fil'],
                'published_at' => now(),
            ],
        ];

        foreach ($stories as $storyData) {
            Story::create($storyData);
        }

        $this->command->info('✅ Cordillera weaving stories seeded successfully with CordiWeave branding!');
    }
}
