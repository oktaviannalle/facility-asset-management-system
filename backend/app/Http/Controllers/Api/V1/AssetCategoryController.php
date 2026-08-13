<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssetCategoryRequest;
use App\Http\Resources\AssetCategoryResource;
use App\Models\AssetCategory;
use Illuminate\Http\Request;

class AssetCategoryController extends Controller
{
    public function index()
    {
        return AssetCategoryResource::collection(
            AssetCategory::withCount('assets')->paginate(10)
        );
    }

    public function store(AssetCategoryRequest $request)
    {
        $category = AssetCategory::create($request->validated());
        return new AssetCategoryResource($category);
    }

    public function show(AssetCategory $assetCategory)
    {
        return new AssetCategoryResource($assetCategory->loadCount('assets'));
    }

    public function update(AssetCategoryRequest $request, AssetCategory $assetCategory)
    {
        $assetCategory->update($request->validated());
        return new AssetCategoryResource($assetCategory);
    }

    public function destroy(AssetCategory $assetCategory)
    {
        $assetCategory->delete();
        return response()->json(['message' => 'Kategori berhasil dihapus']);
    }
}
