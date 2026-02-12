<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        try {
            Log::info("Starting up() for restructuring migration...");

            // 0. Quitar restricción de unicidad en nombre de área si existe
            if ($this->hasIndex('areas', 'areas_name_unique')) {
                Schema::table('areas', function (Blueprint $table) {
                    $table->dropUnique('areas_name_unique');
                });
            }

            // 1. Agregar plant_id a la tabla de áreas si no existe
            if (!Schema::hasColumn('areas', 'plant_id')) {
                Schema::table('areas', function (Blueprint $table) {
                    $table->foreignId('plant_id')->nullable()->after('id')->constrained('plants')->onDelete('cascade');
                });
            }

            // Agregar unique compuesto si no existe
            if (!$this->hasIndex('areas', 'areas_plant_id_name_unique')) {
                Schema::table('areas', function (Blueprint $table) {
                    $table->unique(['plant_id', 'name'], 'areas_plant_id_name_unique');
                });
            }

            // 2. Agregar plant_id y area_id a usuarios
            Schema::table('users', function (Blueprint $table) {
                if (!Schema::hasColumn('users', 'plant_id')) {
                    $table->foreignId('plant_id')->nullable()->after('employee_number')->constrained('plants')->onDelete('set null');
                }
                if (!Schema::hasColumn('users', 'area_id')) {
                    $table->foreignId('area_id')->nullable()->after('plant_id')->constrained('areas')->onDelete('set null');
                }
            });

            // 3. Agregar plant_id a observaciones
            if (!Schema::hasColumn('observations', 'plant_id')) {
                Schema::table('observations', function (Blueprint $table) {
                    $table->foreignId('plant_id')->nullable()->after('area_id')->constrained('plants')->onDelete('set null');
                });
            }

            // 4. Migrar datos existentes (SOLO SI NO SE HA HECHO ANTES)
            // Áreas que no tienen planta todavía (probablemente las originales Planta 1, Planta 2)
            $existingAreas = DB::table('areas')->whereNull('plant_id')->get();

            foreach ($existingAreas as $area) {
                // Insertar como planta
                $plantId = DB::table('plants')->insertGetId([
                    'name' => $area->name,
                    'is_active' => $area->is_active,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $defaultAreas = ['Administración', 'Recursos Humanos', 'Producción', 'Calidad', 'Mantenimiento', 'Logística'];
                foreach ($defaultAreas as $index => $name) {
                    if ($index === 0) {
                        // Reutilizar el registro actual
                        DB::table('areas')->where('id', $area->id)->update([
                            'plant_id' => $plantId,
                            'name' => $name,
                            'updated_at' => now(),
                        ]);
                    } else {
                        DB::table('areas')->insert([
                            'plant_id' => $plantId,
                            'name' => $name,
                            'is_active' => true,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }

                // Actualizar usuarios que estaban en esta "área" (ahora planta)
                DB::table('users')
                    ->where('area', $area->name)
                    ->update(['plant_id' => $plantId]);

                // Actualizar observaciones
                DB::table('observations')
                    ->where('area_id', $area->id)
                    ->update(['plant_id' => $plantId]);
            }

            Log::info("Restructuring migration up() completed successfully.");
        } catch (\Exception $e) {
            Log::error("RESTRUCTURING MIGRATION ERROR: " . $e->getMessage());
            Log::error($e->getTraceAsString());
            throw $e;
        }
    }

    private function hasIndex($table, $indexName)
    {
        $schemaBuilder = Schema::getConnection()->getSchemaBuilder();
        $indexes = $schemaBuilder->getIndexes($table);
        return collect($indexes)->contains('name', $indexName);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('observations', function (Blueprint $table) {
            $table->dropColumn('plant_id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['plant_id', 'area_id']);
        });

        Schema::table('areas', function (Blueprint $table) {
            $table->dropColumn('plant_id');
        });
    }
};
