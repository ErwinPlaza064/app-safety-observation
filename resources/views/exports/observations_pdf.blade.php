<!DOCTYPE html>
<html>
<head>
    <title>Reporte de Observaciones</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #1e3a8a; color: white; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #1e3a8a; }
        .badge { padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; }
        .open { background-color: #e0f2fe; color: #0369a1; }
        .closed { background-color: #dcfce7; color: #15803d; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">WASION Safety Observer</div>
        <p>Reporte General de Seguridad</p>
        <p>Generado el: {{ date('d/m/Y H:i') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Folio</th>
                <th>Fecha</th>
                <th>Reportado Por</th>
                <th>Área</th>
                <th>Tipo</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            @foreach($observations as $obs)
            <tr>
                <td>{{ $obs->folio }}</td>
                <td>{{ $obs->observation_date->format('d/m/Y') }}</td>
                <td>{{ $obs->user->name }}</td>
                <td>{{ $obs->area->name }}</td>
                <td style="text-transform: capitalize;">{{ str_replace('_', ' ', $obs->observation_type) }}</td>
                <td>
                    <span class="badge {{ $obs->status == 'en_progreso' ? 'open' : 'closed' }}">
                        {{ $obs->status == 'en_progreso' ? 'Abierta' : 'Cerrada' }}
                    </span>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
