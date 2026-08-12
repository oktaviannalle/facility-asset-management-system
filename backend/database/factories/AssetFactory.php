<?php

namespace Database\Factories;

use App\Models\Asset;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssetFactory extends Factory
{
    public function definition(): array
    {
        return [
            'asset_code' => 'AST-' . fake()->unique()->numerify('#####'),
            'name' => fake()->randomElement([
                'AC Split 1PK', 'Proyektor', 'Meja Kerja', 'Kursi Kuliah',
                'Laptop Inventaris', 'Lemari Arsip', 'Whiteboard', 'CCTV',
            ]),
            'category_id' => AssetCategory::inRandomOrder()->first()?->id ?? AssetCategory::factory(),
            'location_id' => Location::inRandomOrder()->first()?->id ?? Location::factory(),
            'condition' => fake()->randomElement(['baik', 'rusak_ringan', 'rusak_berat', 'perbaikan']),
            'purchase_date' => fake()->dateTimeBetween('-5 years', 'now'),
            'purchase_price' => fake()->randomFloat(2, 500000, 15000000),
        ];
    }
}
