<?php

namespace Database\Factories;

use App\Models\MaintenanceLog;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MaintenanceLog>
 */
class MaintenanceLogFactory extends Factory
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
            'schedule_id' => MaintenanceSchedule::inRandomOrder()->first()?->id,
            'technician_id' => User::where('role', 'teknisi')->inRandomOrder()->first()?->id
                ?? User::factory()->teknisi(),
            'action_taken' => fake()->sentence(8),
            'cost' => fake()->randomFloat(2, 50000, 2000000),
            'maintenance_date' => fake()->dateTimeBetween('-3 months', 'now'),
        ];
    }
}
