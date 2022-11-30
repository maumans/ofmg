<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Etablissement as ResourcesEtablissement;
use App\Models\Apprenant;
use App\Models\Etablissement;
use App\Models\Mode_paiement;
use App\Models\Mois;
use App\Models\Mois_Paye;
use App\Models\Paiement;
use App\Models\Tarif;
use App\Models\Type_paiement;
use App\Models\User;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Throwable;

class EtablissementController extends Controller
{

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    /**
     * @OA\Examples(
     *          summary= "Etablissement trouvé",
     *          example= "EtablissementSuccess",
     *          value= {
     *              "status": "SUCCESS",
     *              "data": {
     *                      "etablissement":{
     *                      "code": "20220705091618",
     *                      "nom": "Koffi Annan",
     *                      "type": "Université",
     *                  },
     *              }
     *          }
     * )
     * @OA\Examples(
     *          summary= "Etablissement non trouvé",
     *          example= "EtablissementFailed",
     *          value= {
     *              "status": "FAILED",
     *              "data": {
     *                  "etablissement": null
     *              }
     *          }
     * )
     * @OA\Get(
     *      path="/api/etablissement/validation/{code}",
     *      operationId="rechercheEtablissementApi",
     *      tags={"Api Validation du code de l'etablissement"},
     *      summary="Api Validation du code de l'etablissement",
     *      description="Verifie l'existance d'un etablissement sur E-school",
     *      @OA\Response(
     *          response=200,
     *          description="Succès de l'operation",
     *          @OA\JsonContent(
     *              examples = {
     *                  "example1": @OA\Schema(ref="#/components/examples/EtablissementSuccess",example="EtablissementSuccess"),
     *                  "example2": @OA\Schema(ref="#/components/examples/EtablissementFailed",example="EtablissementFailed"),
     *              },
     *          ),
     *      ),
     *      @OA\Parameter(
     *          name="code",
     *          description="Code de l'etablissement",
     *          in="path",
     *          required=true,
     *          @OA\Schema(
     *              type="string"
     *          )
     *      ),
     *
     *      @OA\Response(
     *          response=401,
     *          description="Non authentifié",
     *      ),
     *      @OA\Response(
     *          response=403,
     *          description="Interdit"
     *      ),
     *      @OA\Response(
     *          response=400,
     *          description="Mauvaise requete"
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="Non trouvé"
     *      ),
     *  )
     */
    public function validation($etablissementCode)
    {


        $etablissement=Etablissement::where("code",$etablissementCode)->with("typeEtablissement")->first();

        $données = ["status" => $etablissement ? "SUCCESS":"FAILED","data"=>["etablissement"=>$etablissement ? ["code" => $etablissement->code, "nom" => $etablissement->nom, "type" => $etablissement->typeEtablissement->libelle]:null] ];


        return response()->json($données,200);

    }

    public function chargementOperations($etablissementCode)
    {
        return Type_paiement::whereRelation('tarifs.etablissement',"code", $etablissementCode)->get();
    }


    /**
     * @OA\Examples(
     *          summary= "Apprenant trouvé",
     *          example= "ApprenantSuccess",
     *          value= {
     *              "status": "SUCCESS",
     *              "data": {
     *                      "etablissement":{
     *                          "code": "20220705091618",
     *                          "nom": "Koffi Annan",
     *                          "type": "Université",
     *                      },
     *                      "apprenant": {
     *                          "nom": "Diallo",
     *                           "prenom": "Alpha",
     *                           "matricule": "29M",
     *                           "classe": "Licence 1 Genie logiciel 1"
     *                      },
     *                      "operations": {
     *                          {
     *                              "operation": "Scolarité",
     *                              "MontantGlobal": 200000,
     *                              "resteApayer": 0
     *                          },
     *                          {
     *                               "operation": "Inscription",
     *                               "MontantGlobal": 150000,
     *                               "resteApayer": 0
     *                           }
     *                       }
     *              }
     *          }
     * ),
     *
     * @OA\Examples(
     *          summary= "Apprenant non trouvé",
     *          example= "ApprenantFailed",
     *          value= {
     *              "status": "FAILED",
     *              "data": {
     *                  "etablissement": null,
     *                  "apprenant": null,
     *                  "operations": null
     *              }
     *          }
     * )
     * @OA\Get(
     *      path="/api/etablissement/apprenant/{code}/{matricule}",
     *      operationId="RechercheApprenantApi",
     *      tags={"Api Validation du matricule et chargement des operations"},

     *      summary="Recherche de l'apprenant",
     *      description="Verifie l'existance d'un apprenant au sein d'un etablissement sur E-school",
     *      @OA\Response(
     *          response=200,
     *          description="Succes de l'operation",
     *          @OA\JsonContent(
     *              examples = {
     *                  "example1": @OA\Schema(ref="#/components/examples/ApprenantSuccess",example="ApprenantSuccess"),
     *                  "example2": @OA\Schema(ref="#/components/examples/ApprenantFailed",example="ApprenantFailed"),
     *              },
     *          ),
     *      )
     *      ),
     *      @OA\Parameter(
     *      name="code",
     *      description="Code de l'etablissement",
     *      in="path",
     *      required=true,
     *      @OA\Schema(
     *           type="string"
     *      )
     *   ),
     *     @OA\Parameter(
     *      name="matricule",
     *      description="Matricule de l'apprenant",
     *      in="path",
     *      required=true,
     *      @OA\Schema(
     *           type="string"
     *      )
     *   ),
     *
     *      @OA\Response(
     *          response=401,
     *          description="Non authentifié",
     *      ),
     *      @OA\Response(
     *          response=403,
     *          description="Interdit"
     *      ),
     * @OA\Response(
     *      response=400,
     *      description="Mauvaise requete"
     *   ),
     * @OA\Response(
     *      response=404,
     *      description="Non trouvé"
     *   ),
     *  )
     */

    public function verification($code,$matricule)
    {
        //return Apprenant::where("matricule",$matricule)->first()->classe->etablissement;
        $apprenant = Apprenant::where("matricule",$matricule)->whereRelation("classe.etablissement","code",$code)->with("tarifs.typePaiement")->first();

        $operations=collect();

        if($apprenant)
        {
            foreach($apprenant->tarifs as $tarif)
            {
                $operations->push(["operation"=>$tarif->typePaiement->libelle,"MontantGlobal"=>$tarif->montant,"resteApayer"=>$tarif->pivot->resteApayer]);
            }
            $ap=["nom"=>$apprenant->nom,"prenom"=>$apprenant->prenom,"matricule"=>$apprenant->matricule,"classe"=>$apprenant->classe->libelle];

            $etablissement=Etablissement::where("code",$code)->with("typeEtablissement")->first();

            $et=["code"=>$etablissement->code,"nom"=>$etablissement->nom,"type"=>$etablissement->typeEtablissement->libelle,"numero_depot"=>$etablissement->telephone];
        }
        else
        {
            $operations=null;
            $ap=null;
            $et=null;
        }



        $données=["status"=>$apprenant?"SUCCESS":"FAILED","data"=>["etablissement"=>$et,"apprenant"=>$ap,"operations"=>$operations]];

        return response()->json($données,200);
    }

    /**
     * @OA\Examples(
     *          summary= "Paiement enregistré",
     *          example= "PaiementSuccess",
     *          value= "SUCCESS"
     * )
     * @OA\Examples(
     *          summary= "Paiement non enregistré",
     *          example= "PaiementFailed",
     *          value= "FAILED"
     * )
     * @OA\Post(
     * path="/api/etablissement/apprenant/paiement",
     * operationId="paiementApi",
     * tags={"Api Récuperation des informations du paiement"},
     * summary="Paiement de l'operation",
     * description="Paiement de l'operation pour un apprenant",
     *     @OA\RequestBody(
     *         @OA\JsonContent(),
     *         @OA\MediaType(
     *            mediaType="multipart/form-data",
     *            @OA\Schema(
     *               type="object",
     *               required={"montant", "numero_retrait","status","code","matricule","operation"},
     *               @OA\Property(property="montant", type="number"),
     *               @OA\Property(property="numero_retrait", type="text"),
     *               @OA\Property(property="status", type="text"),
     *               @OA\Property(property="code", type="text"),
     *               @OA\Property(property="matricule", type="text"),
     *               @OA\Property(property="operation", type="text"),
     *            ),
     *        ),
     *    ),
     *      @OA\Response(
     *          response=201,
     *          description="Succes de l'operation",
     *          @OA\JsonContent()
     *       ),
     *      @OA\Response(
     *          response=200,
     *          description="Succes de l'operation",
     *          @OA\JsonContent(
     *              examples = {
     *                  "example1": @OA\Schema(ref="#/components/examples/PaiementSuccess",example="PaiementSuccess"),
     *                  "example2": @OA\Schema(ref="#/components/examples/PaiementFailed",example="PaiementFailed"),
     *              },
     *          ),
     *       ),
     *      @OA\Response(
     *          response=422,
     *          description="Entité non traitable",
     *          @OA\JsonContent()
     *       ),
     *      @OA\Response(response=400, description="Mauvaise requete"),
     *      @OA\Response(response=404, description="Ressource introuvable"),
     * )
     */

    public function paiement(Request $request)
    {

        $apprenant = Apprenant::where("matricule",$request->matricule)->whereRelation("classe.etablissement","code",$request->code)->with("tarifs")->first();

        DB::beginTransaction();

        try{
            if($apprenant)
            {
                $tarif=$apprenant->tarifs()->where("type_paiement_id",Type_paiement::where("libelle",$request->operation)->first()->id)->first();

                if($tarif)
                {
                    $paiement=Paiement::create([
                        "montant"=>$request->montant,
                        "numero_retrait"=>$request->numero_retrait,
                        "transaction_status"=>$request->status,
                        "type_paiement_id"=>$tarif["type_paiement_id"],
                        "mode_paiement_id"=>Mode_paiement::where("libelle","OM USSD")->first()->id,
                    ]);


                    //Paiement::where("id",$paiement->id)->first()->cashin();

                    $paiement->tarif()->associate($tarif->id)->save();
                    $paiement->apprenant()->associate($apprenant)->save();

                    $resteApayer=$tarif["montant"]-$apprenant->paiements->where("tarif_id",$tarif->id)->sum("montant");

                    $apprenant->tarifs()->syncWithoutDetaching([$tarif->id=>["resteApayer"=>$resteApayer]]);

                    $payeParTarif=$apprenant->paiements->where("tarif_id",$tarif->id)->sum("montant");

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


            DB::commit();

            //return response()->json(["apprenant"=>$apprenant,"Paiement"=>$paiement,"Mois payés"=>$moisPaye],200);
            return response()->json($paiement?"SUCCESS":"FAILED",200);

        }
        catch(Throwable $e){

            echo($e);
            DB::rollback();
        }

    }

}
