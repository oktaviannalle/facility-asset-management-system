<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenanceLog extends Model
{
    protected $fillable = ['asset_id', 'schedule_id', 'technician_id', 'action_taken', 'cost', 'maintenance_date'];

    protected $casts = ['maintenance_date' => 'date', 'cost' => 'decimal:2'];

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }

    public function schedule()
    {
        return $this->belongsTo(MaintenanceSchedule::class, 'schedule_id');
    }

    public function technician()
    {
        return $this->belongsTo(User::class, 'technician_id');
    }
}
