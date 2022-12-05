<?php

use App\Http\Controllers\AuthController;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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



Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});


Route::middleware('auth:api')->group(function () {
    Route::get("etablissement/validation/{code}",[\App\Http\Controllers\Api\EtablissementController::class,"validation"])->name("api.etablissement.validation");
    Route::get("etablissement/apprenant/{code}/{matricule}",[\App\Http\Controllers\Api\EtablissementController::class,"verification"])->name("api.etablissement.apprenant.verification");
    Route::post("etablissement/apprenant/paiement/",[\App\Http\Controllers\Api\EtablissementController::class,"paiement"])->name("api.etablissement.apprenant.paiement");
});

Route::post('login',[App\Http\Controllers\Api\AuthController::class,"login"] );
Route::post('register',[App\Http\Controllers\Api\AuthController::class,"register"] );



//Route::apiResource("etablissement",App\Http\Controllers\Api\EtablissementController::class)->only("show");
///Etablissement API
//Route::get("etablissement/chargementOperations/{code}",[\App\Http\Controllers\Api\EtablissementController::class,"chargementOperations"])->name("api.etablissement.chargementOperations");


//Apprenant API
//Route::get("apprenant/validationMatricule/{matricule}",[\App\Http\Controllers\Api\ApprenantController::class,"validationMatricule"])->name("api.apprenant.validationMatricule");
//Route::get("apprenant/chargementInfos/{matricule}",[\App\Http\Controllers\Api\ApprenantController::class,"chargementInfos"])->name("api.apprenant.chargementInfos");

Route::middleware("auth.basic")->any('orange/notifications', function (Request $request) {


        $transaction=Transaction::where("transactionId",$request->transactionData['transactionId'])->first();

        $transaction->status = $request["status"];

        $transaction->message = $request['message'];

        $transaction->save();

        \Illuminate\Support\Facades\Log::info($request->all());

        //Auth::user()->notify(New \App\Notifications\PaiementConfirme($transaction));

});
