<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('employee_number', 50)->unique()->comment('Número de nómina');
            $table->string('name')->comment('Nombre completo del empleado');
            $table->string('email')->unique()->comment('Correo corporativo (@wasion.cn o @wasion.com)');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('area')->nullable()->comment('Área de trabajo');
            $table->string('position')->nullable()->comment('Puesto del empleado');
            $table->boolean('is_ehs_manager')->default(false)->comment('Acceso a dashboard de estadísticas');
            $table->rememberToken();
            $table->timestamps();

            // Índices
            $table->index('employee_number');
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
