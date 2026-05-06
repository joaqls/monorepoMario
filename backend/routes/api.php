<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PersonajeController;

Route::apiResource('personajes', PersonajeController::class);

