<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TestSessionController;
use App\Http\Controllers\HomeController;

// Teste para verificar se a API está funcionando
Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

Route::get('/ping', function () {
    return response()->json(['message' => 'pong']);
});

// Autenticação para API
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Rotas adicionais para API (se necessário)
Route::get('/agendamentos', function () {
    // Aqui você pode retornar um JSON com os dados dos agendamentos
    return response()->json(['agendamentos' => 'lista de agendamentos aqui']);
});

Route::get('/relatorios', function () {
    return response()->json(['relatorios' => 'lista de relatórios aqui']);
});
