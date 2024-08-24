<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ConfigurationsController;
use App\Http\Controllers\CookieCategoryController;
use App\Http\Controllers\CookieController;
use App\Http\Controllers\DomainsController;
use App\Http\Controllers\ImplementationsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportReceiverController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\WebsitesController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    if (!auth()->user()->is_admin) {
        return Redirect::route('domains');
    }
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('banner/{domainId}', [CookieController::class, 'serveBanner']);
Route::get('declaration/{domainId}', [CookieController::class, 'serveDeclaration']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    Route::get('onboarding', [WebsitesController::class, 'onBoarding'])->name('onboarding');
    Route::get('/domains', [DomainsController::class, 'index'])->name('domains');

    Route::get('/configurations', [ConfigurationsController::class, 'index'])->name('configurations');
    Route::post('/configurations', [ConfigurationsController::class, 'update'])->name('configurations.update');

    Route::get('/implementations', [ImplementationsController::class, 'index'])->name('implementations');
    Route::get('/reports', [ReportsController::class, 'index'])->name('reports');

    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics');

    Route::prefix('websites')->group(function () {
        Route::get('/', [WebsitesController::class, 'getAllWebsites'])->name('websites.get-all');
        Route::get('/{id}', [WebsitesController::class, 'getById'])->name('websites.get-by-id');
        Route::get('/{uuid}', [WebsitesController::class, 'getByUUID'])->name('websites.get-by-uuid');
        Route::post('/', [WebsitesController::class, 'store'])->name('websites.store');
        Route::get('/onboarding', [WebsitesController::class, 'onBoarding'])->name('websites.onboard');
        Route::post('/onboarding', [WebsitesController::class, 'onBoardingStore'])->name('websites.onboard.store');
        Route::post('/report-to-email', [WebsitesController::class, 'updateReportToEmail'])->name('websites.report-to-email');
        Route::put('/', [WebsitesController::class, 'update'])->name('websites.update');
        Route::post('/trigger-scan/{id}', [WebsitesController::class, 'triggerScan'])->name('websites.trigger-scan');
        Route::delete('/{id}', [WebsitesController::class, 'destroy'])->name('websites.destroy');
        Route::get('/user/{userId}', [WebsitesController::class, 'getWebsitesByUser'])->name('websites.get-by-user');
        Route::put('/logo', [WebsitesController::class, 'updateLogo'])->name('websites.update-logo');
        Route::delete('/{id}/logo', [WebsitesController::class, 'deleteLogo'])->name('websites.delete-logo');
    });
    
    Route::prefix('cookies')->group(function () {
        Route::get('/', [CookieController::class, 'index'])->name('cookies'); // Retrieve all cookies
        Route::get('/{id}', [CookieController::class, 'show'])->name('cookies.show'); // Retrieve a specific cookie
        Route::post('/', [CookieController::class, 'store'])->name('cookies.store'); // Create a new cookie
        Route::patch('/', [CookieController::class, 'update'])->name('cookies.update'); // Update a cookie
        Route::delete('/{id}', [CookieController::class, 'destroy'])->name('cookies.destroy'); // Delete a cookie
    });
    
    Route::get('/users', [UsersController::class, 'getAllUsers'])->name('users.list');
    Route::post('/users', [UsersController::class, 'store'])->name('users.store');
    Route::patch('/users', [UsersController::class, 'update'])->name('users.update');
    Route::delete('/users/{id}', [UsersController::class, 'destroy'])->name('users.destroy');
    Route::get('/impersonate/stop', [UsersController::class, 'stopImpersonating'])->name('users.stop_impersonate');
    Route::get('/impersonate/{userId}', [UsersController::class, 'impersonate'])->name('users.impersonate');
    
    Route::post('/receivers', [ReportReceiverController::class, 'store'])->name('receivers.store');
    Route::patch('/receivers', [ReportReceiverController::class, 'update'])->name('receivers.update');
    Route::delete('/receivers/{id}', [ReportReceiverController::class, 'destroy'])->name('receivers.destroy');
});

require __DIR__ . '/auth.php';
