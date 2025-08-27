<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />

        <!-- Styles -->
        <style>
            body {
                font-family: 'Figtree', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 0;
                padding: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .container {
                text-align: center;
                background: white;
                padding: 2rem;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                max-width: 600px;
                margin: 0 1rem;
            }
            .title {
                font-size: 2.5rem;
                color: #333;
                margin-bottom: 1rem;
            }
            .subtitle {
                font-size: 1.2rem;
                color: #666;
                margin-bottom: 2rem;
            }
            .links {
                display: flex;
                justify-content: center;
                gap: 1rem;
                flex-wrap: wrap;
            }
            .link {
                background: #667eea;
                color: white;
                padding: 0.75rem 1.5rem;
                text-decoration: none;
                border-radius: 5px;
                transition: background 0.3s;
            }
            .link:hover {
                background: #5a6fd8;
            }
            .api-status {
                margin-top: 2rem;
                padding: 1rem;
                background: #f8f9fa;
                border-radius: 5px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="title">SELabActPrelim API</h1>
            <p class="subtitle">Laravel 11 API Backend</p>
            
            <div class="links">
                <a href="/api/health" class="link">API Health Check</a>
                <a href="/api/v1/status" class="link">API Status</a>
                <a href="http://localhost:3000" class="link">Frontend</a>
            </div>

            <div class="api-status">
                <h3>API Endpoints</h3>
                <p><strong>Health Check:</strong> <code>/api/health</code></p>
                <p><strong>API Status:</strong> <code>/api/v1/status</code></p>
                <p><strong>Frontend:</strong> <code>http://localhost:3000</code></p>
            </div>
        </div>
    </body>
</html>






































