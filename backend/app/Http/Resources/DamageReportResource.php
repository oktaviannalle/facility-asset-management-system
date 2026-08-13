<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DamageReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'description' => $this->description,
            'status' => $this->status,
            'resolved_at' => $this->resolved_at,
            'asset' => new AssetResource($this->whenLoaded('asset')),
            'reporter' => [
                'id' => $this->whenLoaded('reporter', fn () => $this->reporter->id),
                'name' => $this->whenLoaded('reporter', fn () => $this->reporter->name),
            ],
        ];
    }
}
