@echo off
REM Laravel Artisan command wrapper for running from project root
REM Usage: artisan.bat [command] [arguments...]
REM Example: artisan.bat serve
REM Example: artisan.bat migrate
REM Example: artisan.bat make:controller TestController

if "%~1"=="" (
    echo Error: No command specified.
    echo Usage: artisan.bat [command] [arguments...]
    echo Example: artisan.bat serve
    exit /b 1
)

if not exist "api\artisan" (
    echo Error: artisan file not found in api directory.
    echo Make sure you're in the project root directory.
    exit /b 1
)

echo Running: php artisan %*
echo From directory: api\

cd api
php artisan %*
cd ..











