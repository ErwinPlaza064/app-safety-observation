<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\Exportable;

class ObservationsExport implements FromQuery, WithHeadings, WithMapping
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

    public function headings(): array
    {
        return [
            'Folio',
            'Fecha',
            'Usuario',
            'Área',
            'Tipo',
            'Descripción',
            'Categorías',
            'Estado',
        ];
    }

    public function map($observation): array
    {
        return [
            $observation->folio,
            $observation->observation_date->format('Y-m-d'),
            $observation->user->name,
            $observation->area->name,
            $observation->observation_type,
            $observation->description,
            $observation->categories->pluck('name')->implode(', '),
            $observation->status,
        ];
    }
}
