<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nome do acolhido
            $table->string('last_name'); // Sobrenome
            $table->string('cpf'); // CPF
            $table->string('mother_name'); // Nome da mãe
            $table->date('date'); // Data do agendamento
            $table->time('time'); // Hora do agendamento

            // Estado e cidade são opcionais
            $table->string('state')->nullable();
            $table->string('city')->nullable();

            // Telefone opcional
            $table->string('phone')->nullable();

            // Colunas adicionais
            $table->boolean('foreign_country')->default(false); // Indica se o acolhido é estrangeiro
            $table->boolean('no_phone')->default(false); // Indica se o acolhido não tem telefone
            $table->string('gender')->nullable(); // Gênero do acolhido
            $table->date('arrival_date')->nullable(); // Data de chegada
            $table->text('observation')->nullable(); // Observações
            $table->string('photo')->nullable(); // Foto do acolhido

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('appointments');
    }
};
