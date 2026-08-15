<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        $locations = [
            ['building' => 'Gedung FTI UKSW', 'floor' => '1', 'room' => 'R.101 (Lab Networking)'],
            ['building' => 'Gedung FTI UKSW', 'floor' => '1', 'room' => 'R.102 (Lab Hardware)'],
            ['building' => 'Gedung FTI UKSW', 'floor' => '1', 'room' => 'R.105 (Ruang Server)'],
            ['building' => 'Gedung FTI UKSW', 'floor' => '2', 'room' => 'R.201 (Ruang Kuliah)'],
            ['building' => 'Gedung FTI UKSW', 'floor' => '2', 'room' => 'R.205 (Lab Multimedia)'],
            ['building' => 'Gedung FTI UKSW', 'floor' => '3', 'room' => 'R.301 (Ruang Dosen)'],
            ['building' => 'Gedung FTI UKSW', 'floor' => '3', 'room' => 'R.304 (Lab Programming)'],
            ['building' => 'Gedung FTI UKSW', 'floor' => '4', 'room' => 'R.401 (Ruang Seminar)'],
            ['building' => 'Gedung FTI UKSW', 'floor' => '4', 'room' => 'R.465 (Auditorium FTI)'],
        ];

        foreach ($locations as $location) {
            Location::create($location);
        }
    }
}
