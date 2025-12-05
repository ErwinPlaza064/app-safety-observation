<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class ObservationsExport implements FromQuery, WithHeadings, WithMapping, WithStyles, WithColumnWidths, WithTitle
{
    use Exportable;

    protected $query;

    public function __construct($query)
    {
        $this->query = $query;
    }

    public function query()
    {
        return $this->query;
    }

    public function title(): string
    {
        return 'Reportes de Seguridad';
    }

    public function headings(): array
    {
        return [
            'Folio',
            'Fecha',
            'Usuario',
            'N. Nómina',
            'Persona Observada',
            'Área',
            'Tipo',
            'Descripción',
            'Categorías',
            'Estado',
        ];
    }

    public function map($observation): array
    {
        // Mapear tipo de observación a texto legible
        $tipo = match($observation->observation_type) {
            'acto_inseguro' => 'Acto Inseguro',
            'condicion_insegura' => 'Condición Insegura',
            'acto_seguro' => 'Acto Seguro',
            default => $observation->observation_type
        };

        // Mapear estado a texto legible
        $estado = match($observation->status) {
            'en_progreso' => 'En Progreso',
            'cerrada' => 'Cerrada',
            'borrador' => 'Borrador',
            default => $observation->status
        };

        return [
            $observation->folio,
            $observation->observation_date->format('d/m/Y'),
            $observation->user->name,
            $observation->payroll_number ?? 'N/A',
            $observation->observed_person ?? 'N/A',
            $observation->area->name,
            $tipo,
            $observation->description,
            $observation->categories->pluck('name')->implode(', '),
            $estado,
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 18,  // Folio
            'B' => 12,  // Fecha
            'C' => 20,  // Usuario
            'D' => 12,  // N. Nómina
            'E' => 20,  // Persona Observada
            'F' => 15,  // Área
            'G' => 18,  // Tipo
            'H' => 50,  // Descripción
            'I' => 30,  // Categorías
            'J' => 15,  // Estado
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // Estilo del encabezado
        $sheet->getStyle('A1:J1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
                'size' => 11,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '1e3a8a'], // Azul oscuro
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '000000'],
                ],
            ],
        ]);

        // Altura de la fila del encabezado
        $sheet->getRowDimension(1)->setRowHeight(25);

        // Obtener el número total de filas
        $rowCount = $sheet->getHighestRow();

        // Estilo para todas las celdas de datos
        if ($rowCount > 1) {
            $sheet->getStyle('A2:J' . $rowCount)->applyFromArray([
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => 'D1D5DB'],
                    ],
                ],
                'alignment' => [
                    'vertical' => Alignment::VERTICAL_TOP,
                    'wrapText' => true,
                ],
            ]);

            // Centrar columnas específicas
            $sheet->getStyle('A2:B' . $rowCount)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle('D2:D' . $rowCount)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle('F2:G' . $rowCount)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle('J2:J' . $rowCount)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

            // Alternar colores de filas
            for ($row = 2; $row <= $rowCount; $row++) {
                if ($row % 2 == 0) {
                    $sheet->getStyle('A' . $row . ':J' . $row)->applyFromArray([
                        'fill' => [
                            'fillType' => Fill::FILL_SOLID,
                            'startColor' => ['rgb' => 'F9FAFB'],
                        ],
                    ]);
                }
            }

            // Auto-ajustar altura de filas según contenido
            for ($row = 2; $row <= $rowCount; $row++) {
                $sheet->getRowDimension($row)->setRowHeight(-1);
            }
        }

        return [];
    }
}
