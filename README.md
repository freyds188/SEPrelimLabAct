# SELabActPrelim - Monorepo

A monorepo containing a Next.js 14 frontend and Laravel 9 API backend.

## Project Structure

```
SELabActPrelim/
├── frontend/          # Next.js 14 App Router
├── api/              # Laravel 9 API
├── .editorconfig     # Editor configuration
├── .gitignore        # Git ignore patterns
├── LICENSE           # MIT License
└── README.md         # This file
```

## Prerequisites

- **Node.js** (v18 or higher)
- **PHP** (v8.0 or higher)
- **Composer** (latest version)
- **MySQL** or **PostgreSQL** (for Laravel database)

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd SELabActPrelim
```

### 2. Frontend Setup (Next.js)

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at: http://localhost:3000

### 3. Backend Setup (Laravel 9)

```bash
cd api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

The API will be available at: http://localhost:8000

## Development

### Frontend Development

```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Backend Development

```bash
cd api
php artisan serve    # Start development server
php artisan migrate  # Run database migrations
php artisan test     # Run tests
```

## Environment Configuration

### Frontend (.env.local)

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Backend (.env)

The Laravel `.env` file should be configured with your database settings:

```env
APP_NAME=SELabActPrelim
APP_ENV=local
APP_KEY=base64:your-key-here
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=selabactprelim
DB_USERNAME=root
DB_PASSWORD=
```

## API Documentation

The Laravel 9 API includes basic endpoints. You can access the API documentation at:

- API Base URL: http://localhost:8000/api
- Health Check: http://localhost:8000/api/health

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
