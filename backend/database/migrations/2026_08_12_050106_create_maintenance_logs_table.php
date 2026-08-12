<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::create('maintenance_logs', function (Blueprint $table) {
        $table->id();
        $table->foreignId('asset_id')->constrained()->cascadeOnDelete();
        $table->foreignId('schedule_id')->nullable()->constrained('maintenance_schedules')->nullOnDelete();
        $table->foreignId('technician_id')->constrained('users')->cascadeOnDelete();
        $table->text('action_taken');
        $table->decimal('cost', 12, 2)->nullable();
        $table->date('maintenance_date');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_logs');
    }
};
