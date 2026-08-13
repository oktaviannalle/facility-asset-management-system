<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssetRequest;
use App\Http\Resources\AssetResource;
use App\Models\Asset;
use Illuminate\Http\Request;

class AssetController extends Controller
{
    public function index()
    {
        return AssetResource::collection(
            Asset::with('category', 'location')->paginate(10)
        );
    }

    public function store(AssetRequest $request)
    {
        $asset = Asset::create($request->validated());
        return new AssetResource($asset->load('category', 'location'));
    }

    public function show(Asset $asset)
    {
        return new AssetResource($asset->load('category', 'location', 'maintenanceLogs', 'damageReports'));
    }

    public function update(AssetRequest $request, Asset $asset)
    {
        $asset->update($request->validated());
        return new AssetResource($asset->load('category', 'location'));
    }

    public function destroy(Asset $asset)
    {
        $asset->delete();
        return response()->json(['message' => 'Aset berhasil dihapus']);
    }
}
