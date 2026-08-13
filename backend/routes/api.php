<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AssetCategoryController;
use App\Http\Controllers\Api\V1\LocationController;
use App\Http\Controllers\Api\V1\AssetController;
use App\Http\Controllers\Api\V1\MaintenanceScheduleController;
use App\Http\Controllers\Api\V1\MaintenanceLogController;
use App\Http\Controllers\Api\V1\DamageReportController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::apiResource('asset-categories', AssetCategoryController::class);
    Route::apiResource('locations', LocationController::class);
    Route::apiResource('assets', AssetController::class);
    Route::apiResource('maintenance-schedules', MaintenanceScheduleController::class);
    Route::apiResource('maintenance-logs', MaintenanceLogController::class);
    Route::apiResource('damage-reports', DamageReportController::class);
});
