<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reporte de Observaciones de Seguridad</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 10px;
            line-height: 1.4;
            color: #333;
            padding: 15px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 3px solid #1e3a8a;
            padding-bottom: 15px;
        }
        .logo {
            font-size: 20px;
            font-weight: bold;
            color: #1e3a8a;
            margin-bottom: 5px;
        }
        .subtitle {
            font-size: 12px;
            color: #666;
            margin-bottom: 3px;
        }
        .date {
            font-size: 9px;
            color: #999;
        }

        /* Estadísticas */
        .stats-container {
            display: table;
            width: 100%;
            margin-bottom: 20px;
        }
        .stats-row {
            display: table-row;
        }
        .stat-box {
            display: table-cell;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 10px;
            text-align: center;
            width: 16.66%;
        }
        .stat-box + .stat-box {
            border-left: none;
        }
        .stat-number {
            font-size: 18px;
            font-weight: bold;
            color: #1e3a8a;
            display: block;
            margin-bottom: 3px;
        }
        .stat-label {
            font-size: 8px;
            color: #666;
            text-transform: uppercase;
        }

        /* Observaciones */
        .observation {
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 15px;
            background: white;
            page-break-inside: avoid;
        }
        .obs-header {
            display: table;
            width: 100%;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 2px solid #f1f5f9;
        }
        .obs-header-left {
            display: table-cell;
            vertical-align: middle;
        }
        .obs-header-right {
            display: table-cell;
            vertical-align: middle;
            text-align: right;
        }
        .folio {
            font-size: 14px;
            font-weight: bold;
            color: #1e3a8a;
        }
        .obs-date {
            font-size: 9px;
            color: #666;
            margin-top: 2px;
        }

        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 8px;
            font-weight: bold;
        }
        .badge-open {
            background-color: #fef3c7;
            color: #92400e;
            border: 1px solid #fde68a;
        }
        .badge-closed {
            background-color: #d1fae5;
            color: #065f46;
            border: 1px solid #a7f3d0;
        }
        .badge-acto-inseguro {
            background-color: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
        }
        .badge-condicion-insegura {
            background-color: #fed7aa;
            color: #9a3412;
            border: 1px solid #fdba74;
        }
        .badge-acto-seguro {
            background-color: #dbeafe;
            color: #1e40af;
            border: 1px solid #bfdbfe;
        }

        .info-grid {
            display: table;
            width: 100%;
            margin-bottom: 10px;
        }
        .info-row {
            display: table-row;
        }
        .info-item {
            display: table-cell;
            padding: 4px 0;
            width: 50%;
        }
        .info-label {
            font-weight: bold;
            color: #475569;
            font-size: 9px;
        }
        .info-value {
            color: #1e293b;
            margin-top: 2px;
        }

        .description-box {
            background: #f8fafc;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 8px;
            border-left: 3px solid #1e3a8a;
        }
        .section-title {
            font-weight: bold;
            color: #1e3a8a;
            font-size: 9px;
            margin-bottom: 4px;
            text-transform: uppercase;
        }
        .description-text {
            color: #334155;
            line-height: 1.5;
        }

        .categories {
            margin-bottom: 8px;
        }
        .category-tag {
            display: inline-block;
            background: #e0e7ff;
            color: #3730a3;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 8px;
            margin-right: 4px;
            margin-bottom: 4px;
        }

        .closure-box {
            background: #f0fdf4;
            padding: 8px;
            border-radius: 4px;
            border-left: 3px solid #16a34a;
            margin-top: 8px;
        }

        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            font-size: 8px;
            color: #999;
        }

        .no-data {
            text-align: center;
            padding: 40px;
            color: #999;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">WASION Safety Observer</div>
        <div class="subtitle">Reporte Detallado de Observaciones de Seguridad</div>
        <div class="date">Generado el: {{ date('d/m/Y H:i') }}</div>
    </div>

    <!-- Estadísticas -->
    <div class="stats-container">
        <div class="stats-row">
            <div class="stat-box">
                <span class="stat-number">{{ $stats['total'] }}</span>
                <span class="stat-label">Total</span>
            </div>
            <div class="stat-box">
                <span class="stat-number">{{ $stats['abiertas'] }}</span>
                <span class="stat-label">Abiertas</span>
            </div>
            <div class="stat-box">
                <span class="stat-number">{{ $stats['cerradas'] }}</span>
                <span class="stat-label">Cerradas</span>
            </div>
            <div class="stat-box">
                <span class="stat-number">{{ $stats['actos_inseguros'] }}</span>
                <span class="stat-label">Actos Inseguros</span>
            </div>
            <div class="stat-box">
                <span class="stat-number">{{ $stats['condiciones_inseguras'] }}</span>
                <span class="stat-label">Condiciones Inseguras</span>
            </div>
            <div class="stat-box">
                <span class="stat-number">{{ $stats['actos_seguros'] }}</span>
                <span class="stat-label">Actos Seguros</span>
            </div>
        </div>
    </div>

    <!-- Observaciones -->
    @forelse($observations as $obs)
    <div class="observation">
        <div class="obs-header">
            <div class="obs-header-left">
                <div class="folio">{{ $obs->folio }}</div>
                <div class="obs-date">{{ $obs->observation_date->format('d/m/Y') }}</div>
            </div>
            <div class="obs-header-right">
                <span class="badge {{ $obs->status == 'en_progreso' ? 'badge-open' : 'badge-closed' }}">
                    {{ $obs->status == 'en_progreso' ? '● ABIERTA' : '✓ CERRADA' }}
                </span>
                <span class="badge badge-{{ str_replace('_', '-', $obs->observation_type) }}">
                    {{ strtoupper(str_replace('_', ' ', $obs->observation_type)) }}
                </span>
            </div>
        </div>

        <div class="info-grid">
            <div class="info-row">
                <div class="info-item">
                    <div class="info-label">Reportado por:</div>
                    <div class="info-value">{{ $obs->user->name }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Área:</div>
                    <div class="info-value">{{ $obs->area->name }}</div>
                </div>
            </div>
            @if($obs->payroll_number || $obs->observed_person || $obs->company)
            <div class="info-row">
                @if($obs->payroll_number)
                <div class="info-item">
                    <div class="info-label">{{ $obs->company === 'WASION' ? 'N. Nómina:' : 'Identificador:' }}</div>
                    <div class="info-value">{{ $obs->payroll_number }}</div>
                </div>
                @endif
                @if($obs->observed_person)
                <div class="info-item">
                    <div class="info-label">{{ $obs->company === 'WASION' ? 'Persona observada:' : 'Nombre:' }}</div>
                    <div class="info-value">{{ $obs->observed_person }}</div>
                </div>
                @endif
            </div>
            @if($obs->company)
            <div class="info-row">
                <div class="info-item">
                    <div class="info-label">Empresa:</div>
                    <div class="info-value">{{ $obs->company }}</div>
                </div>
                <div class="info-item"></div>
            </div>
            @endif
            @endif
        </div>

        @if($obs->categories->count() > 0)
        <div class="categories">
            <div class="section-title">Categorías</div>
            @foreach($obs->categories as $category)
                <span class="category-tag">{{ $category->name }}</span>
            @endforeach
        </div>
        @endif

        <div class="description-box">
            <div class="section-title">Descripción</div>
            <div class="description-text">{{ $obs->description }}</div>
        </div>

        @if($obs->status == 'cerrada' && $obs->closure_notes)
        <div class="closure-box">
            <div class="section-title">Notas de Cierre</div>
            <div class="description-text">{{ $obs->closure_notes }}</div>
            <div class="obs-date" style="margin-top: 4px;">
                Cerrada el {{ $obs->closed_at->format('d/m/Y H:i') }}
                @if($obs->closedByUser)
                    por {{ $obs->closedByUser->name }}
                @endif
            </div>
        </div>
        @endif
    </div>
    @empty
    <div class="no-data">
        No hay observaciones para mostrar con los filtros aplicados.
    </div>
    @endforelse

    <div class="footer">
        <p>WASION Safety Observer - Sistema de Gestión de Observaciones de Seguridad</p>
        <p>Este documento contiene información confidencial de la empresa</p>
    </div>
</body>
</html>
