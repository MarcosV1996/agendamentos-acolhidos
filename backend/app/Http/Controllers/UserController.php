<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; // Certifique-se de importar isso
use App\Models\User; // Importando o model User

class UserController extends Controller
{
    public function store(Request $request)
    {
        // Validação dos dados
        $validatedData = $request->validate([
            'username' => 'required|unique:users',
            'password' => 'required|min:8',
        ]);

        // Criação do novo usuário
        $user = new User();
        $user->username = $validatedData['username'];
        $user->password = Hash::make($validatedData['password']); // Hash da senha
        $user->save();

        return response()->json(['message' => 'Usuário criado com sucesso']);
    }
}
