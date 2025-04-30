<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ListaController;
use App\Http\Controllers\TarefaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('listas',ListaController::class);
    Route::resource('tarefas',TarefaController::class);

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

   
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
