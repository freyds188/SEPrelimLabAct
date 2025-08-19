<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $e)
    {
        // Handle API requests to always return JSON
        if ($request->expectsJson() || $request->is('api/*')) {
            return $this->handleApiException($e, $request);
        }

        return parent::render($request, $e);
    }

    /**
     * Handle API exceptions and return JSON responses
     */
    protected function handleApiException(Throwable $e, Request $request)
    {
        $statusCode = 500;
        $message = 'Internal Server Error';

        if ($e instanceof ValidationException) {
            $statusCode = 422;
            $message = 'Validation failed';
            return new \Illuminate\Http\JsonResponse([
                'status' => 'error',
                'message' => $message,
                'errors' => $e->errors()
            ], $statusCode);
        }

        if ($e instanceof AuthenticationException) {
            $statusCode = 401;
            $message = 'Unauthenticated';
        }

        if ($e instanceof ModelNotFoundException) {
            $statusCode = 404;
            $message = 'Resource not found';
        }

        if ($e instanceof NotFoundHttpException) {
            $statusCode = 404;
            $message = 'Route not found';
        }

        if ($e instanceof MethodNotAllowedHttpException) {
            $statusCode = 405;
            $message = 'Method not allowed';
        }

        return new \Illuminate\Http\JsonResponse([
            'status' => 'error',
            'message' => $message,
            'error' => config('app.debug') ? $e->getMessage() : null
        ], $statusCode);
    }
}










