<?php

use App\Http\Controllers\AuthController;
use App\Models\Mois;
use App\Models\Mois_Paye;
use App\Models\PaiementGlobal;
use App\Models\Transaction;
use App\Models\User;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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




Route::middleware("auth.basic")->any('orange/notifications', function (Request $request) {


    DB::beginTransaction();

    try{

        $transaction=Transaction::where("transactionId",$request->transactionData['transactionId'])->first();

        $transaction->status = $request["status"];

        $transaction->message = $request['message'];

        $transaction->save();

        $paiementGlobal = PaiementGlobal::where("id",$transaction->item_key)->first();

        $paiementGlobal->transaction()->associate($transaction)->save();

        if($transaction->status=="SUCCESS")
            {

                foreach ($paiementGlobal->paiements as $paiement)
                {
                    $resteApayer=$paiement->tarif["montant"]-$paiement->apprenant->paiements->where("type_paiement_id",$paiement["type_paiement_id"])->sum("montant");
                    $paiement->apprenant->tarifs()->syncWithoutDetaching([$paiement->tarif->id=>["resteApayer"=>$resteApayer]]);


                    foreach($paiement->apprenant->tarifs as $tarif)
                    {
                        $payeParTarif=$paiement->apprenant->paiements->where("tarif_id",$tarif->id)->sum("montant");

                        $intervalle=CarbonPeriod::create($tarif->anneeScolaire->dateDebut,"1 month",$tarif->anneeScolaire->dateFin);

                        $nombreMois=$intervalle->count();

                        $sommeMensuelle=$tarif->montant/$nombreMois;

                        $repartition=$payeParTarif;

                        //dd($payeParTarif,$sommeMensuelle,$tarif->montant);


                        foreach($intervalle as $date)
                        {


                            $moisId=Mois::where("position",$date->month)->first()->id;



                            $moisPaye=Mois_Paye::where("apprenant_tarif_id",$tarif->pivot->id)->where("mois_id",$moisId)->first();


                            if($repartition>=$sommeMensuelle)
                            {
                                $moisPaye->montant=$sommeMensuelle;
                                $moisPaye->save();
                                $repartition=$repartition-$sommeMensuelle;

                            }
                            else
                            {
                                if($repartition==0)
                                {
                                    $moisPaye->montant=0;
                                    $moisPaye->save();


                                }
                                else
                                {
                                    $moisPaye->montant=$repartition;
                                    $moisPaye->save();
                                    $repartition=0;
                                }
                            }

                        }

                    }
                }
            }

        \Illuminate\Support\Facades\Log::info($request->all());

        Auth::user()->notify(New \App\Notifications\PaiementConfirme($transaction));

        DB::commit();
    }
    catch(Throwable $e){
        DB::rollback();
    }
});
