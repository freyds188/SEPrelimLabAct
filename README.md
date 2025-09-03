# CordiWeave - Traditional Filipino Weaving Platform

A comprehensive full-stack web platform dedicated to preserving and promoting traditional Filipino weaving traditions, with a focus on Cordillera weaving communities. Features include an e-commerce shop, cultural stories, admin dashboard, and bilingual support (English/Filipino).

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd CordiWeave

# Install all dependencies
npm run install:all

# Setup database and start development servers
npm run setup
```

## 📋 System Requirements

### Minimum Requirements
- **Node.js**: 18.0.0 or higher
- **PHP**: 8.1 or higher
- **Composer**: 2.0 or higher
- **Git**: Latest version
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space

### Recommended
- **Node.js**: 20.0.0 LTS
- **PHP**: 8.2 or higher
- **Composer**: 2.6 or higher
- **RAM**: 8GB or higher
- **Storage**: 5GB free space

## 🛠️ Complete Installation Guide

### Step 1: Install Prerequisites

#### Windows
1. **Install Node.js**
   - Download from [nodejs.org](https://nodejs.org/)
   - Choose LTS version (20.x.x)
   - Verify: `node --version` and `npm --version`

2. **Install PHP**
   - Download from [windows.php.net](https://windows.php.net/download/)
   - Choose PHP 8.1+ Thread Safe version
   - Extract to `C:\php`
   - Add `C:\php` to PATH environment variable
   - Verify: `php --version`

3. **Install Composer**
   - Download from [getcomposer.org](https://getcomposer.org/download/)
   - Run installer and follow setup wizard
   - Verify: `composer --version`

4. **Install Git**
   - Download from [git-scm.com](https://git-scm.com/)
   - Use default settings during installation
   - Verify: `git --version`

#### macOS
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies
brew install node php composer git
```

#### Linux (Ubuntu/Debian)
```bash
# Update package list
sudo apt update

# Install dependencies
sudo apt install nodejs npm php php-cli php-mbstring php-xml php-curl composer git

# Verify installations
node --version
npm --version
php --version
composer --version
git --version
```

### Step 2: Clone and Setup Project

```bash
# Clone the repository
git clone <repository-url>
cd CordiWeave

# Install all dependencies (frontend + backend)
npm run install:all
```

### Step 3: Backend Setup (Laravel)

```bash
cd api

# Create environment file
copy env.example .env

# Generate application key
php artisan key:generate

# Create required directories (Windows)
mkdir storage\framework\views -Force
mkdir storage\framework\cache -Force
mkdir storage\framework\sessions -Force
mkdir storage\framework\cache\data -Force
mkdir bootstrap\cache -Force

# Create required directories (macOS/Linux)
mkdir -p storage/framework/{views,cache,sessions}
mkdir -p storage/framework/cache/data
mkdir -p bootstrap/cache

# Create SQLite database
New-Item -ItemType File -Path "database\database.sqlite" -Force

# Run migrations
php artisan migrate

# Seed the database with sample data
php artisan db:seed

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### Step 4: Frontend Setup (Next.js)

```bash
cd frontend

# Environment is pre-configured, no additional setup needed
# Verify installation
npm run build
```

### Step 5: Start Development Servers

#### Option A: Start Both Together (Recommended)
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

## 📱 Available Scripts

### Root Level Commands
```bash
npm run dev              # Start both frontend and backend concurrently
npm run frontend         # Start only the Next.js frontend
npm run backend          # Start only the Laravel backend
npm run install:all      # Install dependencies for both apps
npm run setup            # Full setup (install + migrate + seed)
```

### Frontend Commands
```bash
npm run frontend:build   # Build the Next.js app for production
npm run frontend:start   # Start the built Next.js app
npm run frontend:lint    # Run ESLint
npm run frontend:type    # Run TypeScript type checking
```

### Backend Commands
```bash
npm run backend:migrate      # Run Laravel migrations
npm run backend:migrate:fresh # Fresh migrations (drops all tables)
npm run backend:seed         # Seed the database
npm run backend:cache:clear  # Clear Laravel caches
npm run backend:serve        # Start Laravel development server
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://127.0.0.1:8000
- **API Status**: http://127.0.0.1:8000/api/v1/status
- **Admin Dashboard**: http://localhost:3000/en/admin
- **Admin Login**: http://localhost:3000/en/admin/login

## 🔐 Default Credentials

### Admin Dashboard
- **Email**: admin@cordiweave.ph
- **Password**: admin123456

### Test Users
- **Email**: test@cordiweave.ph
- **Password**: password123

## 🎨 Features

### Core Functionality
- **E-commerce Shop**: 102 Cordillera-only products
- **Cultural Stories**: 5 authentic Cordillera weaving stories
- **Admin Dashboard**: Complete admin panel with RBAC
- **Bilingual Support**: English and Filipino languages
- **Responsive Design**: Mobile-first approach

### Technical Features
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Laravel 10, PHP 8.1+, SQLite
- **Authentication**: JWT tokens with Laravel Sanctum
- **Database**: SQLite (dev), PostgreSQL/MySQL ready (prod)
- **API**: RESTful API with comprehensive endpoints

## 📁 Project Structure

```
CordiWeave/
├── api/                          # Laravel Backend
│   ├── app/
│   │   ├── Http/Controllers/    # API Controllers
│   │   ├── Models/              # Eloquent Models
│   │   └── Http/Middleware/     # Custom Middleware
│   ├── database/
│   │   ├── migrations/          # Database Schema
│   │   ├── seeders/             # Sample Data
│   │   └── factories/           # Data Factories
│   ├── routes/api.php           # API Routes
│   └── .env                     # Environment Config
├── frontend/                     # Next.js Frontend
│   ├── app/[locale]/            # Localized Routes
│   ├── components/               # React Components
│   ├── lib/                      # Utilities & Services
│   └── package.json             # Frontend Dependencies
├── README.md                     # This File
└── package.json                  # Root Scripts
```

## 🔧 Development

### Database
- **Development**: SQLite (`api/database/database.sqlite`)
- **Production**: PostgreSQL or MySQL
- **Migrations**: Run `npm run backend:migrate`
- **Seeding**: Run `npm run backend:seed`

### Environment Files
- **Frontend**: Uses default Next.js configuration
- **Backend**: Copy `api/env.example` to `api/.env`

### Git Configuration
The `.gitignore` file excludes:
- `node_modules/` and `vendor/`
- Environment files (`.env`)
- Build artifacts (`.next/`, `dist/`)
- Database files (`*.sqlite`)
- Log files (`*.log`)

## 🚨 Troubleshooting

### Common Issues

#### 1. "Failed to fetch" Error
**Cause**: Backend server not running or configuration issues
**Solution**:
```bash
# Check if Laravel is running
curl http://127.0.0.1:8000/api/v1/status

# Restart backend
cd api
php artisan serve
```

#### 2. "Could not open input file: artisan"
**Cause**: Wrong directory or missing artisan file
**Solution**:
```bash
# Navigate to api directory
cd api
php artisan --version

# Or use root scripts
npm run backend:migrate
```

#### 3. Frontend can't connect to backend
**Cause**: CORS or server configuration issues
**Solution**:
```bash
# Check CORS configuration
cat api/config/cors.php

# Clear Laravel caches
npm run backend:cache:clear
```

#### 4. Database issues
**Cause**: Missing database or migration problems
**Solution**:
```bash
# Reset database completely
npm run backend:migrate:fresh

# Check database file exists
ls api/database/database.sqlite
```

#### 5. Node.js version issues
**Cause**: Incompatible Node.js version
**Solution**:
```bash
# Check Node.js version
node --version

# Install Node.js 18+ if needed
# Download from nodejs.org
```

### Performance Issues

#### Frontend Slow
```bash
# Clear Next.js cache
cd frontend
rm -rf .next
npm run dev
```

#### Backend Slow
```bash
# Clear Laravel caches
cd api
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

## 🔄 Maintenance Commands

### Regular Maintenance
```bash
# Update dependencies
npm run install:all

# Clear all caches
npm run backend:cache:clear

# Reset database
npm run backend:migrate:fresh
```

### Production Preparation
```bash
# Build frontend
npm run frontend:build

# Optimize Laravel
cd api
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test both frontend and backend
5. Commit: `git commit -m "Add feature"`
6. Push: `git push origin feature-name`
7. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

If you encounter issues:

1. Check this README troubleshooting section
2. Check Laravel logs: `api/storage/logs/laravel.log`
3. Check browser console for frontend errors
4. Verify all prerequisites are installed correctly
5. Ensure ports 3000 and 8000 are available

## 🎯 Next Steps

After successful installation:

1. **Explore the Admin Dashboard**: http://localhost:3000/en/admin
2. **Browse the Shop**: http://localhost:3000/en/shop
3. **Read Cultural Stories**: http://localhost:3000/en/stories
4. **Check API Endpoints**: http://127.0.0.1:8000/api/v1/status

Happy coding! 🚀✨
