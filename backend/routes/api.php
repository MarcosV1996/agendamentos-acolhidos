<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TestSessionController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AppointmentController;

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::post('/logout', [AuthController::class, 'logout']);

Route::get('/appointments', [AppointmentController::class, 'index']);

Route::put('/appointments/{appointment}', [AppointmentController::class, 'update']);

Route::get('/appointments/{id}', [AppointmentController::class, 'show']);


Route::middleware('auth:sanctum')->get('/protected-route', function (Request $request) {
    return response()->json(['message' => 'Acesso autorizado']);
});

Route::delete('appointments/{id}', [AppointmentController::class, 'destroy']);


Route::post('/appointments', [AppointmentController::class, 'store']);


Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
