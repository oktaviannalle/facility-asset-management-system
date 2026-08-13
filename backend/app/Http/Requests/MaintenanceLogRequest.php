<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class MaintenanceLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'asset_id' => 'required|exists:assets,id',
            'schedule_id' => 'nullable|exists:maintenance_schedules,id',
            'technician_id' => [
                'required',
                'exists:users,id',
                function ($attribute, $value, $fail) {
                    if (User::find($value)?->role !== 'teknisi') {
                        $fail('User yang dipilih harus memiliki role teknisi.');
                    }
                },
            ],
            'action_taken' => 'required|string',
            'cost' => 'nullable|numeric|min:0',
            'maintenance_date' => 'required|date',
        ];
    }
}
