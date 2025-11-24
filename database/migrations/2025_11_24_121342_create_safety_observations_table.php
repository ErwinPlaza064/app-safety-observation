<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('safety_observations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Información del observador
            $table->string('observer_name');
            $table->string('employee_id');
            $table->string('department');
            $table->string('position')->nullable();
            $table->date('observation_date');
            $table->string('observed_person')->nullable();
            
            // Detalles de la observación
            $table->string('area');
            $table->enum('observation_type', ['unsafe-act', 'unsafe-condition', 'safe-act']);
            $table->json('categories'); // Array de categorías
            $table->text('description');
            $table->json('photos')->nullable(); // Array de rutas de fotos
            
            // Estado
            $table->enum('status', ['draft', 'submitted', 'in-review', 'resolved'])->default('draft');
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('safety_observations');
    }
};