<?php

use App\Http\Controllers\AuthController;
use App\Models\Mois;
use App\Models\Mois_Paye;
use App\Models\Paiement;
use App\Models\Paiement_occasionnel;
use App\Models\PaiementGlobal;
use App\Models\Salaire;
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




Route::middleware("auth.basic")->post('orange/notifications', function (Request $request) {


    DB::beginTransaction();

    \Illuminate\Support\Facades\Log::info($request->all());

    try{

        $transaction=Transaction::where("transactionId",$request->transactionData['transactionId'])->first();

        $transaction->status = $request["status"];

        $transaction->message = $request['message'];

        $transaction->save();


        if($transaction->item_model === "App\Models\Paiement")
        {

            $paiement = Paiement::where("id",$transaction->item_key)->first();

            $paiement->transaction()->associate($transaction)->save();

            $paiement->transaction_status=$transaction->status;

            $paiement->save();
        }
        else if($transaction->item_model === "App\Models\PaiementGlobal")
        {
            $paiementGlobal = PaiementGlobal::where("id",$transaction->item_key)->first();

            $paiementGlobal->transaction()->associate($transaction)->save();

            $paiementGlobal->transaction_status=$transaction->status;

            $paiementGlobal->save();

            if($transaction->type == "CASHOUT")
            {

                if($transaction->status=="SUCCESS")
                {

                    foreach ($paiementGlobal->paiements as $paiement)
                    {
                        $resteApayer=$paiement->tarif["montant"]-$paiement->apprenant->paiements->where("type_paiement_id",$paiement["type_paiement_id"])->sum("montant");
                        $paiement->apprenant->tarifs()->syncWithoutDetaching([$paiement->tarif->id=>["resteApayer"=>$resteApayer]]);

                        $paiement->transaction_status=$transaction->status;
                        $paiement->save();

                        foreach($paiement->apprenant->tarifs as $tarif)
                        {
                            $payeParTarif=$paiement->apprenant->paiements->where("tarif_id",$tarif->id)->sum("montant");

                            $intervalle=CarbonPeriod::create($tarif->anneeScolaire->dateDebut,"1 month",$tarif->anneeScolaire->dateFin)->roundMonth();

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
            }
        }
        else if($transaction->item_model === "App\Models\Salaire")
        {
            $salaire = Salaire::where("id",$transaction->item_key)->first();
            $salaire->transaction()->associate($transaction)->save();
            $salaire->transaction_status=$transaction->status;

            if($transaction->status =="SUCCESS")
            {
                $salaire->niveauValidation=2;
                $salaire->status="VALIDE";
            }

            $salaire->save();
        }
        else if($transaction->item_model === "App\Models\Paiement_occasionnel")
        {
            $paiementOccasionnel = Paiement_occasionnel::where("id",$transaction->item_key)->first();

            $paiementOccasionnel->transaction()->associate($transaction)->save();

            $paiementOccasionnel->transaction_status=$transaction->status;

            if($transaction->status =="SUCCESS")
            {
                $paiementOccasionnel->niveauValidation=2;
                $paiementOccasionnel->status="VALIDE";
            }

            $paiementOccasionnel->save();
        }

        Auth::user()->notify(New \App\Notifications\PaiementConfirme($transaction));

        DB::commit();
    }
    catch(Throwable $e){
        DB::rollback();
    }
});
