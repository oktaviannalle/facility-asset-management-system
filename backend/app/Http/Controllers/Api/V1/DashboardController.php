<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\AssetCategory;
use App\Models\DamageReport;
use App\Models\MaintenanceLog;
use App\Models\MaintenanceSchedule;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $totalAssets = Asset::count();
        $totalAssetValue = Asset::sum('purchase_price') ?? 0;

        // Condition Statistics
        $conditionStats = [
            'baik' => Asset::where('condition', 'baik')->count(),
            'rusak_ringan' => Asset::where('condition', 'rusak_ringan')->count(),
            'rusak_berat' => Asset::where('condition', 'rusak_berat')->count(),
        ];

        // Total maintenance cost
        $totalMaintenanceCost = MaintenanceLog::sum('cost') ?? 0;

        // Monthly maintenance cost (database-agnostic)
        $logs = MaintenanceLog::all();
        $monthlyCosts = $logs->groupBy(function ($log) {
            return date('Y-m', strtotime($log->maintenance_date));
        })->map(function ($group, $key) {
            return [
                'period' => $key,
                'total_cost' => (float) $group->sum('cost'),
                'total_count' => $group->count(),
            ];
        })->sortBy('period')->values();

        // Category distribution
        $categoriesDistribution = AssetCategory::withCount('assets')->get()->map(function ($cat) {
            return [
                'id' => $cat->id,
                'name' => $cat->name,
                'assets_count' => $cat->assets_count,
            ];
        });

        // Damage reports stats
        $damageReportsStats = [
            'total' => DamageReport::count(),
            'dilaporkan' => DamageReport::where('status', 'dilaporkan')->count(),
            'dalam_perbaikan' => DamageReport::where('status', 'dalam_perbaikan')->count(),
            'selesai' => DamageReport::where('status', 'selesai')->count(),
        ];

        // Schedules stats
        $schedulesCount = MaintenanceSchedule::count();

        // Recent Maintenance Logs (5)
        $recentMaintenanceLogs = MaintenanceLog::with(['asset', 'technician'])
            ->orderBy('maintenance_date', 'desc')
            ->take(5)
            ->get()
            ->map(fn ($log) => [
                'id' => $log->id,
                'asset_name' => $log->asset->name ?? '-',
                'asset_code' => $log->asset->asset_code ?? '-',
                'action_taken' => $log->action_taken,
                'cost' => $log->cost,
                'maintenance_date' => $log->maintenance_date,
                'technician_name' => $log->technician->name ?? '-',
            ]);

        // Recent Damage Reports (5)
        $recentDamageReports = DamageReport::with('asset')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(fn ($report) => [
                'id' => $report->id,
                'asset_name' => $report->asset->name ?? '-',
                'asset_code' => $report->asset->asset_code ?? '-',
                'description' => $report->description,
                'status' => $report->status,
                'created_at' => $report->created_at->format('Y-m-d'),
            ]);

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_assets' => $totalAssets,
                'total_asset_value' => (float) $totalAssetValue,
                'condition_stats' => $conditionStats,
                'total_maintenance_cost' => (float) $totalMaintenanceCost,
                'monthly_maintenance_costs' => $monthlyCosts,
                'category_distribution' => $categoriesDistribution,
                'damage_reports_stats' => $damageReportsStats,
                'schedules_count' => $schedulesCount,
                'recent_maintenance_logs' => $recentMaintenanceLogs,
                'recent_damage_reports' => $recentDamageReports,
            ],
        ]);
    }
}
