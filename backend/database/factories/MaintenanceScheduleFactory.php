<?php

namespace Database\Factories;

use App\Models\Asset;
use App\Models\MaintenanceSchedule;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MaintenanceSchedule>
 */
class MaintenanceScheduleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'asset_id' => Asset::inRandomOrder()->first()?->id ?? Asset::factory(),
            'maintenance_type' => fake()->randomElement([
                'Servis AC', 'Cek instalasi listrik', 'Pengecatan ulang', 'Kalibrasi alat',
            ]),
            'frequency_months' => fake()->randomElement([1, 3, 6, 12]),
            'next_due_date' => fake()->dateTimeBetween('now', '+6 months'),
        ];
    }
}
