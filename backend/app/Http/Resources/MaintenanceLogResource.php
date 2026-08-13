<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MaintenanceLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'action_taken' => $this->action_taken,
            'cost' => $this->cost,
            'maintenance_date' => $this->maintenance_date,
            'asset' => new AssetResource($this->whenLoaded('asset')),
            'schedule' => new MaintenanceScheduleResource($this->whenLoaded('schedule')),
            'technician' => [
                'id' => $this->whenLoaded('technician', fn () => $this->technician->id),
                'name' => $this->whenLoaded('technician', fn () => $this->technician->name),
            ],
        ];
    }
}
