<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\MaintenanceLogRequest;
use App\Http\Resources\MaintenanceLogResource;
use App\Models\MaintenanceLog;
use Illuminate\Http\Request;

class MaintenanceLogController extends Controller
{
    public function index()
    {
        return MaintenanceLogResource::collection(
            MaintenanceLog::with('asset', 'schedule', 'technician')->paginate(10)
        );
    }

    public function store(MaintenanceLogRequest $request)
    {
        $log = MaintenanceLog::create($request->validated());
        return new MaintenanceLogResource($log->load('asset', 'schedule', 'technician'));
    }

    public function show(MaintenanceLog $maintenanceLog)
    {
        return new MaintenanceLogResource($maintenanceLog->load('asset', 'schedule', 'technician'));
    }

    public function update(MaintenanceLogRequest $request, MaintenanceLog $maintenanceLog)
    {
        $maintenanceLog->update($request->validated());
        return new MaintenanceLogResource($maintenanceLog->load('asset', 'schedule', 'technician'));
    }

    public function destroy(MaintenanceLog $maintenanceLog)
    {
        $maintenanceLog->delete();
        return response()->json(['message' => 'Riwayat maintenance berhasil dihapus']);
    }
}
