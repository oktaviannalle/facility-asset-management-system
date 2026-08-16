<?php

namespace Database\Seeders;

use App\Models\Asset;
use App\Models\DamageReport;
use App\Models\MaintenanceLog;
use App\Models\MaintenanceSchedule;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed default demo accounts safely with updateOrCreate
        User::updateOrCreate(
            ['email' => 'admin@sarpras.test'],
            ['name' => 'Admin Sarpras', 'password' => Hash::make('password'), 'role' => 'admin']
        );
        User::updateOrCreate(
            ['email' => 'admin@fti.uksw.edu'],
            ['name' => 'Admin FTI', 'password' => Hash::make('password'), 'role' => 'admin']
        );
        User::updateOrCreate(
            ['email' => 'teknisi@fti.uksw.edu'],
            ['name' => 'Teknisi FTI', 'password' => Hash::make('password'), 'role' => 'teknisi']
        );
        User::updateOrCreate(
            ['email' => 'user@fti.uksw.edu'],
            ['name' => 'Demo User (Read Only)', 'password' => Hash::make('password'), 'role' => 'staff']
        );
        User::updateOrCreate(
            ['email' => 'user@sarpras.test'],
            ['name' => 'Demo Staff', 'password' => Hash::make('password'), 'role' => 'staff']
        );

        $this->call([
            AssetCategorySeeder::class,
            LocationSeeder::class,
        ]);
    }
}
