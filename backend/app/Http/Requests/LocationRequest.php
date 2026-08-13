<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LocationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'building' => 'required|string|max:255',
            'floor' => 'nullable|string|max:50',
            'room' => 'nullable|string|max:255',
        ];
    }
}
