<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

Route::get('/', [\App\Http\Controllers\WelcomeController::class,'home'])->name("welcome");

Route::get('/portofolio', function () {
    return Inertia::render('Portofolio');
})->name("portofolio");


Route::middleware(['auth', 'verified',"userIsAdminOrOfmg","firstConnexion","passwordChangeDate"])->group(function (){
    Route::resource('admin.user',\App\Http\Controllers\Admin\UserController::class);
    Route::resource('admin.role',\App\Http\Controllers\Admin\RoleController::class);
    Route::resource('admin.fonction',\App\Http\Controllers\Admin\FonctionController::class);
    Route::resource('admin.modePaiement',\App\Http\Controllers\Admin\ModePaiementController::class);
    Route::resource('admin.matiere',\App\Http\Controllers\Admin\MatiereController::class);
    Route::resource('admin.codeNumero',\App\Http\Controllers\Admin\CodeNumeroController::class);

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
    Route::resource('etablissement.departement',\App\Http\Controllers\Etablissement\DepartementController::class);
    Route::resource('etablissement.cycle',\App\Http\Controllers\Etablissement\CycleController::class);
    Route::resource('etablissement.option',\App\Http\Controllers\Etablissement\OptionController::class);
    Route::resource('etablissement.classe',\App\Http\Controllers\Etablissement\ClasseController::class)->middleware("anneeScolaireIsDefined");
    Route::resource('etablissement.matiere',\App\Http\Controllers\Etablissement\MatiereController::class);
    Route::resource('etablissement.tarif',\App\Http\Controllers\Etablissement\TarifController::class)->middleware("anneeScolaireIsDefined");
    Route::resource('etablissement.paiement',\App\Http\Controllers\Etablissement\PaiementController::class)->middleware("anneeScolaireIsDefined");
    Route::post("etablissement/{userId}/paiement/search/{matricule?}",[\App\Http\Controllers\Etablissement\PaiementController::class,"search"])->middleware("anneeScolaireIsDefined")->name("etablissement.paiement.search");

    Route::post("etablissement/{etablissementId}/paiement/filtre",[\App\Http\Controllers\Etablissement\PaiementController::class,"filtre"])->name("etablissement.paiement.filter");


    Route::resource('etablissement.anneeScolaire',\App\Http\Controllers\Etablissement\AnneeScolaireController::class);
    Route::get("etablissement/anneeScolaire/cloture",[\App\Http\Controllers\Etablissement\AnneeScolaireController::class,"cloture"])->name("etablissement.anneeScolaire.cloture")->middleware("anneeScolaireIsDefined");

    Route::resource('etablissement.inscription',\App\Http\Controllers\Etablissement\InscriptionController::class)->middleware("anneeScolaireIsDefined");
    Route::post("etablissement/{userId}/inscription/import",[\App\Http\Controllers\Etablissement\InscriptionController::class,"import"])->name("etablissement.inscription.import")->middleware("anneeScolaireIsDefined");

    Route::resource('etablissement.contrat',\App\Http\Controllers\Etablissement\ContratController::class)->middleware("anneeScolaireIsDefined");
    Route::resource('etablissement.personnel',\App\Http\Controllers\Etablissement\PersonnelController::class)->middleware("anneeScolaireIsDefined");
    Route::resource('etablissement.fonction',\App\Http\Controllers\Etablissement\FonctionController::class);


    Route::resource('etablissement.scolarite',\App\Http\Controllers\Etablissement\ScolariteController::class);

    //Route::resource('etablissement.personnel.horaire',\App\Http\Controllers\Etablissement\PersonnelController::class)->middleware("anneeScolaireIsDefined");
    /////
    Route::get("etablissement/{userId}/personnel/horaire/index",[\App\Http\Controllers\Etablissement\Personnel\horaireController::class,"index"])->name("etablissement.personnel.horaire.index")->middleware("anneeScolaireIsDefined");
    Route::get("etablissement/{userId}/personnel/horaire/{personnelId}",[\App\Http\Controllers\Etablissement\Personnel\horaireController::class,"show"])->name("etablissement.personnel.horaire.show")->middleware("anneeScolaireIsDefined");
    Route::post("etablissement/{userId}/personnel/horaire",[\App\Http\Controllers\Etablissement\Personnel\horaireController::class,"store"])->name("etablissement.personnel.horaire.store")->middleware("anneeScolaireIsDefined");
    Route::post("etablissement/{etablissementId}/personnel/historique/filtre",[\App\Http\Controllers\Etablissement\PersonnelController::class,"filtre"])->name("etablissement.personnel.historique.filter");


    Route::get("etablissement/{userId}/personnel/paiement/salaire",[\App\Http\Controllers\Etablissement\PersonnelController::class,"salaire"])->name("etablissement.personnel.paiement.salaire")->middleware("anneeScolaireIsDefined");
    Route::get("etablissement/{userId}/personnel/paiement/validationSalaire",[\App\Http\Controllers\Etablissement\PersonnelController::class,"validationSalaire"])->name("etablissement.personnel.paiement.validationSalaire")->middleware("anneeScolaireIsDefined");
    Route::get("etablissement/{userId}/personnel/paiement/historique/{ok?}",[\App\Http\Controllers\Etablissement\PersonnelController::class,"historique"])->name("etablissement.personnel.paiement.historique")->middleware("anneeScolaireIsDefined");
    Route::get("etablissement/{userId}/personnel/paiement/listePaiementRapport/{ok?}",[\App\Http\Controllers\Etablissement\PersonnelController::class,"listePaiementRapport"])->name("etablissement.personnel.paiement.ListePaiementRapport");
    Route::post("etablissement/{userId}/personnel/paiement/salaire/{moisId}",[\App\Http\Controllers\Etablissement\PersonnelController::class,"salaireStore"])->name("etablissement.personnel.paiement.salaire.store")->middleware("anneeScolaireIsDefined");
    Route::post("etablissement/{userId}/personnel/paiementOccasionel",[\App\Http\Controllers\Etablissement\PersonnelController::class,"salaireOccasionnelStore"])->name("etablissement.personnel.paiementeOccasionnel")->middleware("anneeScolaireIsDefined");

    Route::post("etablissement/{userId}/personnel/paiement/validationSalaireStore",[\App\Http\Controllers\Etablissement\PersonnelController::class,"validationStore"])->name("etablissement.personnel.paiement.validationSalaire.store")->middleware("anneeScolaireIsDefined");
    Route::post("etablissement/{userId}/personnel/paiement/validationCancel",[\App\Http\Controllers\Etablissement\PersonnelController::class,"validationCancel"])->name("etablissement.personnel.paiement.validationCancel")->middleware("anneeScolaireIsDefined");

    Route::post("etablissement/{userId}/personnel/paiement/validationOccasionnelStore",[\App\Http\Controllers\Etablissement\PersonnelController::class,"validationOccasionnelStore"])->name("etablissement.personnel.paiement.validationOccasionnel.store")->middleware("anneeScolaireIsDefined");
    Route::post("etablissement/{userId}/personnel/paiement/validationOccasionnelCancel",[\App\Http\Controllers\Etablissement\PersonnelController::class,"validationOccasionnelCancel"])->name("etablissement.personnel.paiement.validationOccasionnelCancel")->middleware("anneeScolaireIsDefined");



    Route::get("etablissement/{userId}/inscription/search/tuteur/{search}",[\App\Http\Controllers\Etablissement\InscriptionController::class,"search"])->name("etablissement.inscription.tuteur.search")->middleware("anneeScolaireIsDefined");
    Route::get("etablissement/{userId}/contrat/search/personnels/{search}",[\App\Http\Controllers\Etablissement\ContratController::class,"search"])->name("etablissement.contrat.personnel.search")->middleware("anneeScolaireIsDefined");
    Route::resource('etablissement.apprenant',\App\Http\Controllers\Etablissement\ApprenantController::class);

    Route::post("etablissement/{userId}/inscription/searchInscription",[\App\Http\Controllers\Etablissement\InscriptionController::class,"searchInscription"])->name("etablissement.inscription.searchInscription");
});

Route::middleware(['auth', 'verified',"userIsTuteur","firstConnexion"])->group(function (){
    Route::resource('tuteur.paiement',\App\Http\Controllers\Tuteur\PaiementController::class);
    Route::get("tuteur/paiement/ok/{total}/{paiementGlobalId}",[\App\Http\Controllers\Tuteur\PaiementController::class,"ok"])->name("tuteur.paiement.ok");
    Route::get("tuteur/{userId}/paiement/search/{matricule?}",[\App\Http\Controllers\Tuteur\PaiementController::class,"search"])->name("tuteur.paiement.search");
    Route::post("tuteur/{userId}/paiement/filtre",[\App\Http\Controllers\Tuteur\PaiementController::class,"filtre"])->name("tuteur.paiement.filtre");

});

Route::resource('paiement',\App\Http\Controllers\PaiementController::class);
Route::get("paiement/search/{code?}/{matricule?}",[\App\Http\Controllers\PaiementController::class,"search"])->name("paiement.search");
Route::get("paiement/ok/{apprenantId}/{total}",[\App\Http\Controllers\PaiementController::class,"ok"])->name("paiement.ok");

require __DIR__.'/auth.php';
