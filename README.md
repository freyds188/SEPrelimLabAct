# CordiWeave - Traditional Filipino Weaving Platform

A comprehensive web platform dedicated to preserving and promoting traditional Filipino weaving traditions, with a focus on Cordillera weaving communities.

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd CordiWeave
```

## 📋 Available Scripts

### Root Level Commands
- `npm run dev` - Start both frontend and backend concurrently
- `npm run frontend` - Start only the Next.js frontend
- `npm run backend` - Start only the Laravel backend
- `npm run install:all` - Install dependencies for both apps
- `npm run setup` - Full setup (install + migrate + seed)

### Frontend Commands
- `npm run frontend:build` - Build the Next.js app for production
- `npm run frontend:start` - Start the built Next.js app

### Backend Commands
- `npm run backend:migrate` - Run Laravel migrations
- `npm run backend:migrate:fresh` - Fresh migrations (drops all tables)
- `npm run backend:seed` - Seed the database
- `npm run backend:cache:clear` - Clear Laravel caches

## 🛠️ Complete Setup Guide

### Step 1: Install Dependencies
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../api
composer install
```

### Step 2: Backend Setup (Laravel)

#### 2.1 Environment Configuration
```bash
cd api

# Create environment file
copy env.example .env

# Generate application key
php artisan key:generate
```

#### 2.2 Create Required Directories
```bash
# Create storage directories
mkdir storage\framework\views -Force
mkdir storage\framework\cache -Force
mkdir storage\framework\sessions -Force
mkdir storage\framework\cache\data -Force
mkdir bootstrap\cache -Force
mkdir resources\views -Force
```

#### 2.3 Database Setup
```bash
# Create SQLite database file
New-Item -ItemType File -Path "database\database.sqlite" -Force

# Run migrations
php artisan migrate

# (Optional) Seed the database
php artisan db:seed
```

#### 2.4 Clear Caches
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### Step 3: Frontend Setup (Next.js)

#### 3.1 Environment Configuration
```bash
cd frontend

# Create environment file if needed
# The frontend should work with default settings
```

#### 3.2 Build and Start
```bash
# Build the application
npm run build

# Start development server
npm run dev
```

### Step 4: Start Both Applications

#### Option A: Start Both Together
```bash
# From project root
npm run dev
```

#### Option B: Start Separately
```bash
# Terminal 1 - Backend
cd api
php artisan serve --host=127.0.0.1 --port=8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🛠️ Laravel Artisan Commands

### From Project Root (Recommended)
```bash
# PowerShell
.\artisan.ps1 serve
.\artisan.ps1 migrate
.\artisan.ps1 make:controller TestController

# Windows Command Prompt
artisan.bat serve
artisan.bat migrate
artisan.bat make:controller TestController
```

### From API Directory
```bash
cd api
php artisan serve
php artisan migrate
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://127.0.0.1:8000
- **API Status**: http://127.0.0.1:8000/api/v1/status
- **API Health Check**: http://127.0.0.1:8000/api/ping

## 🔐 Authentication

The application includes a complete authentication system:

- **Registration**: `/auth/register`
- **Login**: `/auth/login`
- **Protected Routes**: All POST/PUT/DELETE operations require authentication
- **JWT Tokens**: Laravel Sanctum for API authentication

### Testing Authentication
```bash
# Test registration
$body = @{ name = "Test User"; email = "test@example.com"; password = "password123"; password_confirmation = "password123" } | ConvertTo-Json
Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/v1/auth/register" -Method POST -Body $body -ContentType "application/json"

# Test login
$body = @{ email = "test@example.com"; password = "password123" } | ConvertTo-Json
Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/v1/auth/login" -Method POST -Body $body -ContentType "application/json"
```

## 📁 Key Files

### Frontend (`frontend/`)
- `app/[locale]/auth/` - Authentication pages
- `components/layout/` - Navigation and layout components
- `lib/auth.ts` - Authentication service
- `components/ui/` - Reusable UI components

### Backend (`api/`)
- `app/Http/Controllers/Api/` - API controllers
- `app/Models/` - Eloquent models
- `routes/api.php` - API routes
- `database/migrations/` - Database schema
- `config/cors.php` - CORS configuration

## 🎨 Features

- **Internationalization**: English and Filipino support
- **Accessibility**: WCAG 2.2 AA compliant
- **Form Validation**: React Hook Form + Zod
- **Toast Notifications**: User feedback
- **Responsive Design**: Mobile-first approach
- **Type Safety**: TypeScript throughout

## 🔧 Development

### Database
The project uses SQLite for development. The database file is located at `api/database/database.sqlite`.

### Environment Files
- Frontend: `frontend/.env.local` (if needed)
- Backend: `api/.env`

### Git
The `.gitignore` file is configured to exclude:
- `node_modules/` and `vendor/`
- Environment files (`.env`)
- Build artifacts (`.next/`, `dist/`)
- Database files (`*.sqlite`)

## 🚨 Troubleshooting

### "Failed to fetch" Error
This usually indicates a backend issue. Check:

1. **Backend Server Running**: Ensure Laravel is running on `http://127.0.0.1:8000`
2. **Missing Configuration Files**: Ensure all Laravel config files exist:
   - `api/config/session.php`
   - `api/config/cache.php`
   - `api/config/view.php`
3. **Missing Directories**: Create required storage directories
4. **Database Issues**: Run migrations and check database connection

### "Could not open input file: artisan"
- Make sure you're running artisan commands from the project root using the wrapper scripts
- Or navigate to the `api/` directory first

### Frontend can't connect to backend
- Ensure the Laravel server is running on `http://127.0.0.1:8000`
- Check that CORS is properly configured in `api/config/cors.php`
- Verify the API endpoints are working: `http://127.0.0.1:8000/api/v1/status`

### Database issues
- Run `npm run backend:migrate:fresh` to reset the database
- Ensure SQLite is working: `npm run backend:migrate`
- Check database file exists: `api/database/database.sqlite`

### SSR Issues (window is not defined)
- Use `usePathname()` from Next.js instead of `window.location.pathname`
- Ensure all client-side code is properly marked with `"use client"`

### Laravel 500 Errors
1. Check Laravel logs: `api/storage/logs/laravel.log`
2. Clear all caches: `php artisan config:clear && php artisan cache:clear`
3. Regenerate autoload: `composer dump-autoload`
4. Check environment file exists and has proper configuration

## 🔄 Common Commands

### Backend Maintenance
```bash
cd api

# Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Regenerate autoload
composer dump-autoload

# Reset database
php artisan migrate:fresh --seed
```

### Frontend Maintenance
```bash
cd frontend

# Clear Next.js cache
rm -rf .next
npm run dev

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.
