<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('observations', function (Blueprint $table) {
            $table->id();
            $table->string('folio', 20)->unique();

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('observation_date');
            $table->string('observed_person')->nullable();

            $table->foreignId('area_id')->constrained()->restrictOnDelete();
            $table->enum('observation_type', ['acto_inseguro', 'condicion_insegura', 'acto_seguro']);

            $table->text('description');

            $table->enum('status', ['borrador', 'en_progreso', 'cerrada'])->default('borrador');
            $table->boolean('is_draft')->default(false);

            $table->timestamp('closed_at')->nullable();
            $table->foreignId('closed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('closure_notes')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('observation_type');
            $table->index('observation_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('observations');
    }
};
