<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class MaintenanceScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'asset_id' => 'required|exists:assets,id',
            'maintenance_type' => 'required|string|max:255',
            'frequency_months' => 'required|integer|min:1',
            'next_due_date' => 'required|date',
        ];
    }
}
