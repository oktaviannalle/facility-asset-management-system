<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\AssetCategoryController;
use App\Http\Controllers\Api\V1\LocationController;
use App\Http\Controllers\Api\V1\AssetController;
use App\Http\Controllers\Api\V1\MaintenanceScheduleController;
use App\Http\Controllers\Api\V1\MaintenanceLogController;
use App\Http\Controllers\Api\V1\DamageReportController;
use App\Http\Controllers\Api\V1\DashboardController;

Route::prefix('v1')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
        Route::get('dashboard/stats', [DashboardController::class, 'index']);

        Route::apiResource('asset-categories', AssetCategoryController::class)->only(['index', 'show']);
        Route::apiResource('locations', LocationController::class)->only(['index', 'show']);
        Route::apiResource('assets', AssetController::class)->only(['index', 'show']);
        Route::apiResource('maintenance-schedules', MaintenanceScheduleController::class)->only(['index', 'show']);
        Route::apiResource('maintenance-logs', MaintenanceLogController::class)->only(['index', 'show']);
        Route::apiResource('damage-reports', DamageReportController::class)->only(['index', 'show']);

        Route::post('damage-reports', [DamageReportController::class, 'store']);

        Route::middleware('role:admin,teknisi')->group(function () {
            Route::apiResource('assets', AssetController::class)->only(['store', 'update']);
            Route::apiResource('maintenance-schedules', MaintenanceScheduleController::class)->only(['store', 'update', 'destroy']);
            Route::apiResource('maintenance-logs', MaintenanceLogController::class)->only(['store', 'update']);
            Route::apiResource('damage-reports', DamageReportController::class)->only(['update']);
        });

        Route::middleware('role:admin')->group(function () {
            Route::apiResource('asset-categories', AssetCategoryController::class)->only(['store', 'update', 'destroy']);
            Route::apiResource('locations', LocationController::class)->only(['store', 'update', 'destroy']);
            Route::apiResource('assets', AssetController::class)->only(['destroy']);
            Route::apiResource('maintenance-logs', MaintenanceLogController::class)->only(['destroy']);
            Route::apiResource('damage-reports', DamageReportController::class)->only(['destroy']);
        });
    });
});
