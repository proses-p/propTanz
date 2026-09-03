<?php

use App\Http\Controllers\Api\HostelController;
use App\Http\Controllers\Api\OwnerRequestController;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {

    Route::post('/register', [AuthController::class, 'register']);

    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {

        Route::middleware('role:ADMIN')->group(function () {

            Route::get('/owner-request', [OwnerRequestController::class, 'index']);
            Route::patch('/hostels/{hostel}/approving', [HostelController::class, 'approving']);
            Route::patch('/hostels/{hostel}/rejecting', [HostelController::class, 'rejecting']);
            Route::patch('/owner-request/{ownerRequest}/approve', [OwnerRequestController::class, 'approve']);
            Route::patch('/owner-request/{ownerRequest}/reject', [OwnerRequestController::class, 'reject']);
        });

        Route::middleware('role:ADMIN,USER')->group(function () {
            Route::get('/hostels', [HostelController::class, 'index']);
            Route::get('/hostels/statistics', [HostelController::class, 'statistics']);
            Route::get('/hostels/{hostel}', [HostelController::class, 'show']);
            Route::post('/hostels', [HostelController::class, 'store']);
            Route::put('/hostels/{hostel}', [HostelController::class, 'update']);
            Route::patch('/hostels/{hostel}', [HostelController::class, 'update']);
            Route::delete('/hostels/{hostel}', [HostelController::class, 'destroy']);

        });

        Route::middleware('role:USER')->group(function () {
            Route::get('/browse/hostels', [HostelController::class, 'browse']);
        });

        Route::post('/owner-request', [OwnerRequestController::class, 'store']);

        Route::get('/owner-request/status', [OwnerRequestController::class, 'myStatus']);

        Route::post('/logout', [AuthController::class, 'logout']);

    });

});




