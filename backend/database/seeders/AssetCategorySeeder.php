<?php

namespace Database\Seeders;

use App\Models\AssetCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AssetCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
  public function run(): void
    {
        $categories = [
            ['name' => 'Elektronik', 'description' => 'AC, komputer, proyektor, dan perangkat elektronik lainnya'],
            ['name' => 'Mebel', 'description' => 'Meja, kursi, lemari, dan perabot lainnya'],
            ['name' => 'Bangunan', 'description' => 'Komponen gedung seperti atap, pintu, jendela'],
        ];

        foreach ($categories as $category) {
            AssetCategory::create($category);
        }
    }
}
