<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\LocationRequest;
use App\Http\Resources\LocationResource;
use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index()
    {
        return LocationResource::collection(
            Location::withCount('assets')->paginate(10)
        );
    }

    public function store(LocationRequest $request)
    {
        $location = Location::create($request->validated());

        return new LocationResource($location);
    }

    public function show(Location $location)
    {
        return new LocationResource($location->loadCount('assets'));
    }

    public function update(LocationRequest $request, Location $location)
    {
        $location->update($request->validated());

        return new LocationResource($location);
    }

    public function destroy(Location $location)
    {
        $location->delete();

        return response()->json([
            'message' => 'Lokasi berhasil dihapus'
        ]);
    }
}
