<?php

namespace App\Exports;

use App\Models\Observation;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ObservationsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Observation::with(['user', 'area', 'categories'])->submitted()->get();
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
