<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\MaintenanceScheduleRequest;
use App\Http\Resources\MaintenanceScheduleResource;
use App\Models\MaintenanceSchedule;
use Illuminate\Http\Request;

class MaintenanceScheduleController extends Controller
{
    public function index()
    {
        return MaintenanceScheduleResource::collection(
            MaintenanceSchedule::with('asset')->paginate(10)
        );
    }

    public function store(MaintenanceScheduleRequest $request)
    {
        $schedule = MaintenanceSchedule::create($request->validated());
        return new MaintenanceScheduleResource($schedule->load('asset'));
    }

    public function show(MaintenanceSchedule $maintenanceSchedule)
    {
        return new MaintenanceScheduleResource($maintenanceSchedule->load('asset', 'logs'));
    }

    public function update(MaintenanceScheduleRequest $request, MaintenanceSchedule $maintenanceSchedule)
    {
        $maintenanceSchedule->update($request->validated());
        return new MaintenanceScheduleResource($maintenanceSchedule->load('asset'));
    }

    public function destroy(MaintenanceSchedule $maintenanceSchedule)
    {
        $maintenanceSchedule->delete();
        return response()->json(['message' => 'Jadwal maintenance berhasil dihapus']);
    }
}
