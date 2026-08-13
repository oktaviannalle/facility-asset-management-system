<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MaintenanceScheduleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'maintenance_type' => $this->maintenance_type,
            'frequency_months' => $this->frequency_months,
            'next_due_date' => $this->next_due_date,
            'asset' => new AssetResource($this->whenLoaded('asset')),
        ];
    }
}
