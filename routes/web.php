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


Route::middleware(['auth', 'verified',"userIsAdmin","firstConnexion","passwordChangeDate"])->group(function (){
    Route::resource('admin.user',\App\Http\Controllers\Admin\UserController::class);
    Route::resource('admin.role',\App\Http\Controllers\Admin\RoleController::class);
    Route::resource('admin.etablissement',\App\Http\Controllers\Admin\EtablissementController::class);
    Route::resource('admin.typePaiement',\App\Http\Controllers\Admin\TypePaiementController::class);
    Route::resource('admin.region',\App\Http\Controllers\Admin\RegionController::class);
    Route::resource('admin.cycle',\App\Http\Controllers\Admin\CycleController::class);
    Route::resource('admin.departement',\App\Http\Controllers\Admin\DepartementController::class);
    Route::resource('admin.option',\App\Http\Controllers\Admin\OptionController::class);
    Route::resource('admin.niveau',\App\Http\Controllers\Admin\NiveauController::class);
    Route::resource('admin.ville',\App\Http\Controllers\Admin\VilleController::class);
    Route::resource('admin.commune',\App\Http\Controllers\Admin\CommuneController::class);
});

Route::middleware(['auth', 'verified',"userIsEtablissement","firstConnexion","passwordChangeDate"])->group(function (){
    Route::resource('etablissement',\App\Http\Controllers\EtablissementController::class);
    Route::resource('etablissement.niveau',\App\Http\Controllers\Etablissement\NiveauController::class)->middleware("anneeScolaireIsDefined");
    Route::resource('etablissement.classe',\App\Http\Controllers\Etablissement\ClasseController::class)->middleware("anneeScolaireIsDefined");
    Route::resource('etablissement.tarif',\App\Http\Controllers\Etablissement\TarifController::class)->middleware("anneeScolaireIsDefined");
    Route::resource('etablissement.paiement',\App\Http\Controllers\Etablissement\PaiementController::class)->middleware("anneeScolaireIsDefined");
    Route::post("etablissement/{userId}/paiement/search/{matricule?}",[\App\Http\Controllers\Etablissement\PaiementController::class,"search"])->middleware("anneeScolaireIsDefined")->name("etablissement.paiement.search");

    Route::resource('etablissement.anneeScolaire',\App\Http\Controllers\Etablissement\AnneeScolaireController::class);
    Route::resource('etablissement.inscription',\App\Http\Controllers\Etablissement\InscriptionController::class)->middleware("anneeScolaireIsDefined");
    Route::get("etablissement/{userId}/inscription/search/tuteur/{search}",[\App\Http\Controllers\Etablissement\InscriptionController::class,"search"])->name("etablissement.inscription.tuteur.search")->middleware("anneeScolaireIsDefined");
    Route::resource('etablissement.apprenant',\App\Http\Controllers\Etablissement\ApprenantController::class);

    Route::post("etablissement/{userId}/inscription/searchInscription",[\App\Http\Controllers\Etablissement\InscriptionController::class,"searchInscription"])->name("etablissement.inscription.searchInscription");
});

Route::middleware(['auth', 'verified',"userIsTuteur","firstConnexion"])->group(function (){
    Route::resource('tuteur.paiement',\App\Http\Controllers\Tuteur\PaiementController::class);
    Route::get("tuteur/paiement/ok/{total}",[\App\Http\Controllers\Tuteur\PaiementController::class,"ok"])->name("tuteur.paiement.ok");
    Route::get("tuteur/{userId}/paiement/search/{matricule?}",[\App\Http\Controllers\Tuteur\PaiementController::class,"search"])->name("tuteur.paiement.search");
});

require __DIR__.'/auth.php';
