<?php

use App\Http\Controllers\CookieController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\ScanController;
use App\Http\Controllers\WebsitesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/cookies/client/{id}', [CookieController::class, 'getCookiesByDomainId']);
Route::post('/cookies/scan/result', [CookieController::class, 'storeBatch']);
Route::get('cookies/websites/{domainId}/cookies-categorized', [CookieController::class, 'checkCookiesCategorized']);

Route::post('/webhook/report', [ReportsController::class, 'store']);

Route::get('/trigger/scan/{id}', [WebsitesController::class, 'triggerScanAPI']);
Route::post('/scan', [WebsitesController::class, 'sendToQueueFromAPI']);
Route::put('websites/{id}/consent-widget-mounted', [WebsitesController::class, 'updateConsentWidgetMounted']);
Route::put('websites/{id}/cookies-table-mounted', [WebsitesController::class, 'updateCookiesTableMounted']);
Route::put('websites/{id}/open-gtag-defaults', [WebsitesController::class, 'updateOpenGtagDefaults']);