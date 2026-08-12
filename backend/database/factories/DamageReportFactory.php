<?php

namespace Database\Factories;

use App\Models\Asset;
use App\Models\DamageReport;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DamageReport>
 */
class DamageReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = fake()->randomElement(['dilaporkan', 'diverifikasi', 'dikerjakan', 'selesai']);

        return [
            'asset_id' => Asset::inRandomOrder()->first()?->id ?? Asset::factory(),
            'reported_by' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'description' => fake()->sentence(10),
            'status' => $status,
            'resolved_at' => $status === 'selesai' ? fake()->dateTimeBetween('-1 month', 'now') : null,
        ];
    }
}
