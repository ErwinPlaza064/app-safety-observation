<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificar Correo Electrónico</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #1e40af;
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
        }
        .content {
            padding: 30px 20px;
            color: #333333;
            line-height: 1.6;
        }
        .greeting {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .button {
            display: inline-block;
            background-color: #1e40af;
            color: #ffffff;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Safetyobservation</h1>
        </div>
        <div class="content">
            <div class="greeting">Hola, {{ $name }}</div>

            <p>Gracias por registrarte en el Sistema de Observaciones de Seguridad de Wasion.</p>

            <p>Por favor, verifica tu dirección de correo electrónico haciendo clic en el botón de abajo.</p>

            <div class="button-container">
                <a href="http://localhost/safety-observation/public/dashboard" class="button">
                    Verificar Correo Electrónico
                </a>
            </div>

            <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
        </div>
        <div class="footer">
            <p>Atentamente,</p>
            <p><strong>Equipo de Seguridad e Higiene - Wasion</strong></p>
        </div>
    </div>
</body>
</html>
