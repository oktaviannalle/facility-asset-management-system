<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenanceSchedule extends Model
{
    protected $fillable = ['asset_id', 'maintenance_type', 'frequency_months', 'next_due_date'];

    protected $casts = ['next_due_date' => 'date'];

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }

    public function logs()
    {
        return $this->hasMany(MaintenanceLog::class, 'schedule_id');
    }
}
