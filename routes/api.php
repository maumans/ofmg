<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/user-profile', [AuthController::class, 'userProfile']);
    Route::get("etablissement/apprenant/{code}/{matricule}",[\App\Http\Controllers\Api\EtablissementController::class,"verification"])->name("api.etablissement.apprenant.verification");
});

//Route::apiResource("etablissement",App\Http\Controllers\Api\EtablissementController::class)->only("show");
///Etablissement API
//Route::get("etablissement/chargementOperations/{code}",[\App\Http\Controllers\Api\EtablissementController::class,"chargementOperations"])->name("api.etablissement.chargementOperations");


//Apprenant API
//Route::get("apprenant/validationMatricule/{matricule}",[\App\Http\Controllers\Api\ApprenantController::class,"validationMatricule"])->name("api.apprenant.validationMatricule");
//Route::get("apprenant/chargementInfos/{matricule}",[\App\Http\Controllers\Api\ApprenantController::class,"chargementInfos"])->name("api.apprenant.chargementInfos");
