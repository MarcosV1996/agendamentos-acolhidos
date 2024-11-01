<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TestSessionController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});
/* testar rota do banco de dados
Route::get('/check-password', function () {
    $user = User::where('username', 'admin')->first();
    if (Hash::check('password123', $user->password)) {
        return 'A senha está correta!';
    } else {
        return 'A senha está incorreta.';
    }
}); */

// Obter o token CSRF para proteção de formulários
Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

// Página de login (para exibir o formulário de login)
Route::get('/login', function () {
    return view('auth.login');
})->name('login');

// Endpoint para autenticação de login (somente para a web)
Route::post('/login', [AuthController::class, 'login'])->name('login.attempt');

// Endpoint para logout (somente para a web)
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Página inicial após o login
Route::get('/home', [HomeController::class, 'index'])->name('home');

// Página inicial do site
Route::get('/', function () {
    return view('welcome');
})->name('welcome');

// Páginas adicionais para navegação
Route::get('/about', function () {
    return view('about');
})->name('about');

Route::get('/contato', function () {
    return view('contato');
})->name('contato');

Route::get('/privacidade', function () {
    return view('privacidade');
})->name('privacidade');

// Páginas de agendamentos e relatórios (visualizações HTML)
Route::get('/agendamentos', function () {
    return view('agendamentos');
})->name('agendamentos');

Route::get('/relatorios', function () {
    return view('relatorios');
})->name('relatorios');

// Rota para o teste de sessão
Route::get('/test-session', [TestSessionController::class, 'test'])->name('test-session');

// Middleware para CORS, se necessário
Route::middleware([\App\Http\Middleware\CorsMiddleware::class])->group(function () {
    // Adicione suas rotas protegidas por CORS aqui
});
