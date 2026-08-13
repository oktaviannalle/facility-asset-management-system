<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\DamageReportRequest;
use App\Http\Resources\DamageReportResource;
use App\Models\DamageReport;
use Illuminate\Http\Request;

class DamageReportController extends Controller
{
    public function index()
    {
        return DamageReportResource::collection(
            DamageReport::with('asset', 'reporter')->paginate(10)
        );
    }

    public function store(DamageReportRequest $request)
    {
        $report = DamageReport::create($request->validated());
        return new DamageReportResource($report->load('asset', 'reporter'));
    }

    public function show(DamageReport $damageReport)
    {
        return new DamageReportResource($damageReport->load('asset', 'reporter'));
    }

    public function update(DamageReportRequest $request, DamageReport $damageReport)
    {
        $damageReport->update($request->validated());
        return new DamageReportResource($damageReport->load('asset', 'reporter'));
    }

    public function destroy(DamageReport $damageReport)
    {
        $damageReport->delete();
        return response()->json(['message' => 'Laporan kerusakan berhasil dihapus']);
    }
}
