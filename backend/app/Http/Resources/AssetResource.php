<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssetResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'asset_code' => $this->asset_code,
        'name' => $this->name,
        'condition' => $this->condition,
        'purchase_date' => $this->purchase_date,
        'purchase_price' => $this->purchase_price,
        'category' => new AssetCategoryResource($this->whenLoaded('category')),
        'location' => new LocationResource($this->whenLoaded('location')),
    ];
}
}
