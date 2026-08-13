<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AssetRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
  public function rules(): array
{
    return [
        'asset_code' => 'required|string|unique:assets,asset_code,' . $this->asset?->id,
        'name' => 'required|string|max:255',
        'category_id' => 'required|exists:asset_categories,id',
        'location_id' => 'required|exists:locations,id',
        'condition' => 'required|in:baik,rusak_ringan,rusak_berat,perbaikan',
        'purchase_date' => 'nullable|date',
        'purchase_price' => 'nullable|numeric|min:0',
    ];
}
}
