<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DamageReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'asset_id' => 'required|exists:assets,id',
            'reported_by' => 'required|exists:users,id',
            'description' => 'required|string',
            'status' => 'required|in:dilaporkan,diverifikasi,dikerjakan,selesai',
        ];
    }
}
