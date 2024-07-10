<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\{
    TemplateController
};

Route::prefix('templates')->group(function () {
    Route::get('/', [TemplateController::class, 'index'])->withoutMiddleware(['auth:sanctum']);
    Route::get('show/{id}', [TemplateController::class, 'show']);
    Route::post('create', [TemplateController::class, 'create']);
    Route::post('update/{id}', [TemplateController::class, 'update']);
    Route::post('delete', [TemplateController::class, 'destroy']);
});