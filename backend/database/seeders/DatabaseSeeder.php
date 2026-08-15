<?php

namespace Database\Seeders;

use App\Models\Asset;
use App\Models\DamageReport;
use App\Models\MaintenanceLog;
use App\Models\MaintenanceSchedule;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->admin()->create(['name' => 'Admin Sarpras', 'email' => 'admin@sarpras.test']);
        User::factory()->teknisi()->count(3)->create();
        User::factory()->staff()->count(5)->create();

        $this->call([
            AssetCategorySeeder::class,
            LocationSeeder::class,
        ]);

        // Generate exactly 20 asset records for FTI UKSW
        Asset::factory()->count(20)->create();
        MaintenanceSchedule::factory()->count(10)->create();
        MaintenanceLog::factory()->count(20)->create();
        DamageReport::factory()->count(10)->create();
    }
}
