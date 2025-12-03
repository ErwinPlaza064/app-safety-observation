<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\Category;
use App\Models\Observation;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class ObservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener las áreas de plantas 1, 3 y 5
        $areas = Area::whereIn('name', ['Planta 1', 'Planta 3', 'Planta 5'])->get();

        if ($areas->isEmpty()) {
            $this->command->error('No se encontraron las áreas Planta 1, 3 y 5. Ejecuta primero AreaSeeder.');
            return;
        }

        // Obtener categorías
        $categories = Category::all();

        if ($categories->isEmpty()) {
            $this->command->error('No se encontraron categorías. Ejecuta primero CategorySeeder.');
            return;
        }

        // Obtener usuarios existentes o crear uno de prueba
        $users = User::all();

        if ($users->isEmpty()) {
            $this->command->error('No se encontraron usuarios. Ejecuta primero AdminUserSeeder.');
            return;
        }

        // Datos ficticios para generar observaciones realistas
        $nombresPersonas = [
            'Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez',
            'Roberto Hernández', 'Laura Sánchez', 'Miguel Ángel Torres', 'Patricia Ramírez',
            'Fernando González', 'Lucía Rodríguez', 'José Luis Flores', 'Carmen Díaz',
            'Ricardo Morales', 'Sofía Castro', 'Eduardo Vargas', 'Daniela Reyes',
            'Alejandro Ruiz', 'Gabriela Mendoza', 'Francisco Jiménez', 'Verónica Ortiz'
        ];

        $descripcionesActoInseguro = [
            'Se observó al colaborador trabajando sin utilizar los guantes de protección requeridos para manipular materiales cortantes.',
            'El trabajador fue visto operando maquinaria pesada sin el casco de seguridad correspondiente.',
            'Se detectó que el empleado no estaba utilizando los lentes de seguridad en el área de soldadura.',
            'Colaborador manipulando sustancias químicas sin la máscara de protección respiratoria adecuada.',
            'Se observó al operador utilizando su teléfono celular mientras operaba el montacargas.',
            'Trabajador transitando por áreas restringidas sin la autorización correspondiente.',
            'Se detectó que el empleado estaba corriendo en el área de producción, ignorando las señales de precaución.',
            'Colaborador levantando cargas pesadas de manera incorrecta, sin doblar las rodillas.',
            'Se observó al trabajador subido en un rack de almacenamiento sin equipo de protección contra caídas.',
            'Empleado manipulando herramientas eléctricas con las manos mojadas.',
            'Se detectó trabajador fumando en área no autorizada cerca de materiales inflamables.',
            'Colaborador retirando las guardas de seguridad de la maquinaria para acelerar el proceso.',
            'Se observó al empleado utilizando herramientas dañadas que representan riesgo de lesión.',
            'Trabajador ignorando las señales de alto y cruzando cuando el montacargas estaba en movimiento.',
            'Se detectó que el operador no realizó el check-list previo antes de operar el equipo.',
        ];

        $descripcionesCondicionInsegura = [
            'Se identificó un derrame de aceite en el pasillo principal que no ha sido señalizado ni limpiado.',
            'Las luminarias del área de empaque están dañadas, generando zonas de poca visibilidad.',
            'Se detectó que las escaleras de emergencia tienen pasamanos sueltos que requieren reparación.',
            'El extintor de la zona de producción está vencido y necesita ser recargado.',
            'Se observó cableado eléctrico expuesto en el área de mantenimiento que representa riesgo de electrocución.',
            'Las señales de evacuación en el pasillo norte están deterioradas y no son legibles.',
            'Se identificó que la ventilación en el área de pintura no está funcionando correctamente.',
            'El piso del área de carga presenta grietas y desniveles que pueden causar tropiezos.',
            'Se detectó que los estantes de almacenamiento están sobrecargados y pueden colapsar.',
            'Las puertas de emergencia están obstruidas con material de empaque.',
            'Se observó que el sistema de alarma contra incendios no está funcionando en el sector B.',
            'Los equipos de protección personal almacenados están deteriorados y requieren reemplazo.',
            'Se identificó fuga de aire comprimido en las líneas de producción.',
            'El área de químicos no cuenta con la ventilación adecuada según normativa.',
            'Se detectó que las regaderas de emergencia no tienen presión de agua suficiente.',
        ];

        $descripcionesActoSeguro = [
            'Se observó al colaborador utilizando correctamente todo su equipo de protección personal durante toda la jornada.',
            'El trabajador realizó el bloqueo y etiquetado correcto antes de dar mantenimiento a la máquina.',
            'Se reconoce al equipo de trabajo por mantener su área limpia y ordenada constantemente.',
            'El operador realizó todas las inspecciones pre-operacionales antes de utilizar el montacargas.',
            'Se observó al colaborador ayudando a un compañero nuevo explicándole los procedimientos de seguridad.',
            'El trabajador reportó inmediatamente una condición insegura que detectó en su área.',
            'Se reconoce al empleado por utilizar siempre las tres puntas de apoyo al subir escaleras.',
            'Colaborador utilizando correctamente la técnica de levantamiento de cargas pesadas.',
            'Se observó al trabajador verificando el estado de sus herramientas antes de usarlas.',
            'El equipo de turno nocturno mantuvo excelentes prácticas de seguridad durante toda la semana.',
            'Se reconoce al supervisor por realizar las pláticas de seguridad diarias con su equipo.',
            'Colaborador deteniendo la operación al detectar una anomalía en el equipo.',
            'Se observó al trabajador usando correctamente el arnés de seguridad en trabajo en alturas.',
            'El empleado siguió correctamente el procedimiento de emergencia durante el simulacro.',
            'Se reconoce al área de mantenimiento por mantener sus herramientas en excelente estado.',
        ];

        $notasCierre = [
            'Se habló con el colaborador y se le brindó retroalimentación sobre la importancia de seguir los procedimientos de seguridad.',
            'Se implementó acción correctiva y se programó capacitación adicional para el personal del área.',
            'Condición corregida. Se instaló nueva señalización y se reparó el equipo afectado.',
            'Se realizó reconocimiento público al colaborador por su comportamiento ejemplar.',
            'Situación resuelta. Se actualizó el procedimiento de trabajo para evitar recurrencia.',
            'Se coordinó con mantenimiento para la reparación inmediata. Verificado y cerrado.',
            'Acción preventiva implementada. Se reforzó la capacitación en el área.',
            'Observación documentada y compartida en la reunión de seguridad semanal.',
        ];

        $observationTypes = ['acto_inseguro', 'condicion_insegura', 'acto_seguro'];
        $statuses = ['en_progreso', 'cerrada'];

        $this->command->info('Creando 60 observaciones ficticias...');

        // Generar 60 observaciones (20 por cada planta)
        $observacionesPorPlanta = 20;
        $folio = 1;

        foreach ($areas as $area) {
            for ($i = 0; $i < $observacionesPorPlanta; $i++) {
                $observationType = $observationTypes[array_rand($observationTypes)];
                $status = $statuses[array_rand($statuses)];
                $user = $users->random();

                // Seleccionar descripción según el tipo
                $descripcion = match($observationType) {
                    'acto_inseguro' => $descripcionesActoInseguro[array_rand($descripcionesActoInseguro)],
                    'condicion_insegura' => $descripcionesCondicionInsegura[array_rand($descripcionesCondicionInsegura)],
                    'acto_seguro' => $descripcionesActoSeguro[array_rand($descripcionesActoSeguro)],
                };

                // Fecha aleatoria en los últimos 3 meses
                $observationDate = Carbon::now()->subDays(rand(1, 90));

                // Datos de cierre si está cerrada
                $closedAt = null;
                $closedBy = null;
                $closureNotes = null;

                if ($status === 'cerrada') {
                    $closedAt = $observationDate->copy()->addDays(rand(1, 14));
                    $closedBy = $users->random()->id;
                    $closureNotes = $notasCierre[array_rand($notasCierre)];
                }

                // Persona observada (puede ser null para condiciones inseguras)
                $observedPerson = $observationType === 'condicion_insegura'
                    ? null
                    : $nombresPersonas[array_rand($nombresPersonas)];

                // Crear la observación
                $observation = Observation::create([
                    'folio' => 'OBS-' . str_pad($folio, 5, '0', STR_PAD_LEFT),
                    'user_id' => $user->id,
                    'area_id' => $area->id,
                    'observation_date' => $observationDate,
                    'observed_person' => $observedPerson,
                    'observation_type' => $observationType,
                    'description' => $descripcion,
                    'status' => $status,
                    'is_draft' => false,
                    'closed_at' => $closedAt,
                    'closed_by' => $closedBy,
                    'closure_notes' => $closureNotes,
                ]);

                // Asignar 1-3 categorías aleatorias
                $randomCategories = $categories->random(rand(1, 3))->pluck('id')->toArray();
                $observation->categories()->attach($randomCategories);

                $folio++;
            }

            $this->command->info("✓ {$observacionesPorPlanta} observaciones creadas para {$area->name}");
        }

        $this->command->info('');
        $this->command->info("✅ Se crearon 60 observaciones exitosamente.");
        $this->command->info("   - Planta 1: 20 observaciones");
        $this->command->info("   - Planta 3: 20 observaciones");
        $this->command->info("   - Planta 5: 20 observaciones");
    }
}
