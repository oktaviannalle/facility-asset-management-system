<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
   public function run(): void
    {
        $locations = [
            ['building' => 'Gedung A', 'floor' => '1', 'room' => 'Lab Komputer 1'],
            ['building' => 'Gedung A', 'floor' => '2', 'room' => 'Ruang Dosen'],
            ['building' => 'Gedung B', 'floor' => '1', 'room' => 'Ruang Kuliah B1'],
            ['building' => 'Gedung Rektorat', 'floor' => '1', 'room' => 'Sarana dan Prasarana'],
        ];

        foreach ($locations as $location) {
            Location::create($location);
        }
    }
}
