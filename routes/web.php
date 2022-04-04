<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name("welcome");


Route::middleware(['auth', 'verified',"userIsAdmin"])->group(function (){
    Route::resource('admin.user',\App\Http\Controllers\Admin\UserController::class);
    Route::resource('admin.role',\App\Http\Controllers\Admin\RoleController::class);
    Route::resource('admin.etablissement',\App\Http\Controllers\Admin\EtablissementController::class);
    Route::resource('admin.typePaiement',\App\Http\Controllers\Admin\TypePaiementController::class);
    Route::resource('admin.region',\App\Http\Controllers\Admin\RegionController::class);
    Route::resource('admin.ville',\App\Http\Controllers\Admin\VilleController::class);
    Route::resource('admin.commune',\App\Http\Controllers\Admin\CommuneController::class);
});

Route::middleware(['auth', 'verified',"userIsEtablissement"])->group(function (){
    Route::resource('etablissement',\App\Http\Controllers\EtablissementController::class);
    Route::resource('etablissement.niveau',\App\Http\Controllers\Etablissement\NiveauController::class);
    Route::resource('etablissement.tarif',\App\Http\Controllers\Etablissement\TarifController::class);
    Route::resource('etablissement.anneeScolaire',\App\Http\Controllers\Etablissement\AnneeScolaireController::class);
    Route::resource('etablissement.inscription',\App\Http\Controllers\Etablissement\InscriptionController::class);
    Route::resource('etablissement.apprenant',\App\Http\Controllers\Etablissement\ApprenantController::class);

});

Route::middleware(['auth', 'verified',"userIsTuteur"])->group(function (){
    Route::resource('paiement',\App\Http\Controllers\PaiementController::class)->except("store");
    Route::resource('paiement',\App\Http\Controllers\PaiementController::class)->only("store");
    Route::get("/paiement/search/{matricule?}",[\App\Http\Controllers\PaiementController::class,"search"])->name("paiement.search");
});

require __DIR__.'/auth.php';
