<?php

namespace App\Http\Controllers;

use App\Models\Apprenant;
use App\Models\Code_numero;
use App\Models\Etablissement;
use App\Models\Mode_paiement;
use App\Models\Mois;
use App\Models\Mois_Paye;
use App\Models\Paiement;
use App\Models\PaiementGlobal;
use App\Models\Tarif;
use App\Models\Type_paiement;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Throwable;

class PaiementController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render("Paiement/Index");
    }

    public function search($code,$matricule)
    {
        $codeNumeros=Code_numero::all();
        $apprenant=Apprenant::where("matricule",$matricule)->first();

        $etablissement=$apprenant ? $apprenant->classe->etablissement:null;

        $anneeEnCours=$etablissement ? $etablissement->anneeEnCours:null;

        if ($anneeEnCours)
        {

            $apprenant=$apprenant ? Apprenant::where("matricule",$matricule)->whereRelation("classe.etablissement","code",$code)->with(["tarifs"=>function($query) use ($anneeEnCours){
                $query->whereRelation('anneeScolaire','id',$anneeEnCours->id)->with(["typePaiement",'apprenantTarif.moisPayes'])->get();
            },"classe"=>function($query) use ($anneeEnCours){
                $query->with(["tarifs"=>function($query) use ($anneeEnCours){
                    $query->whereRelation('anneeScolaire','id',$anneeEnCours->id)->where('status',true)->with("typePaiement")->get();
                }]);
            },
               "paiements"=>function($query) use ($anneeEnCours,$apprenant){
              $query->whereHas("tarif",function ($query) use ($anneeEnCours,$apprenant){
                  $query->where('annee_scolaire_id', $anneeEnCours->id)->where('status',true);
              })->with(["typePaiement","tarif"=>function($query){
                  $query->where('status',true);
              }])->get();

            }
            ])->first():$apprenant;

            $nbrMois=$anneeEnCours ? Carbon::parse($anneeEnCours->dateFin)->diffInMonths(Carbon::parse($anneeEnCours->dateDebut)):null;

            $apprenant && $apprenant->classe->tarifs->map(function($tarif) use($apprenant){

              $tarif->resteApayer=$tarif->montant-$apprenant->paiements->where("type_paiement_id",$tarif->typePaiement->id)->sum("montant");
            });

            //dd($apprenant);


            $paiements=$apprenant ? $apprenant->paiements()->with("tarif","typePaiement")->get()->unique('type_paiement_id'):null;

            $apprenant ?  $paiements->map(function($paiement) use ($apprenant)
            {
                $paiement->resteApayer=$paiement->tarif->montant-$apprenant->paiements->where("type_paiement_id",$paiement->tarif->typePaiement->id)->sum("montant");
            }):null;


            $modePaiements=Mode_paiement::all();

            /*
            $tuteur=User::where('id',Auth::user()->id)->with(["paiementsTuteur"=>function($query){
                $query->orderByDesc('created_at')->with("apprenant","typePaiement","modePaiement","tarif")->get();
            }])->first();
            */

            return Inertia::render("Paiement/Create",["etablissement"=>$etablissement,"apprenant"=>$apprenant,"matricule"=>$matricule,"nbrMois"=>$nbrMois,"modePaiements"=>$modePaiements,"paiements"=>$paiements,"codeNumeros"=>$codeNumeros,'code'=>$code,'']);
        }
        else
        {
            return redirect()->back()->with("error","L'année n'a pas encore débutée pour cet établissement");
        }

        }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        /*
        $tuteur=User::where('id',Auth::user()->id)->with(["paiementsTuteur"=>function($query){
            $query->orderByDesc('created_at')->with("apprenant","typePaiement","modePaiement","tarif")->get();
        }])->first();
        */

        return Inertia::render("Paiement/Create");
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Exception|\Illuminate\Http\RedirectResponse|Throwable
     */
    public function store(Request $request)
    {

        DB::beginTransaction();

        try{

            $paiementGlobal=PaiementGlobal::create([
                "montant" =>$request->total,
                "numero_retrait" =>$request->numero_retrait,
                "etablissement_id"=>$request->etablissement["id"],
                //"tuteur_id"=>Auth::user()->id
            ]);

            foreach ($request->tarifs as $key =>$value)
            {
                $info=explode("_",$key);
                $apprenant=Apprenant::find($info[0]);

                $tarif=Tarif::where("id",$info[1])->first();

                if($value)
                {

                    $paiement=Paiement::create([
                        "montant"=>$request->montants[$info[0]."_".$info[1]],
                        "numero_retrait"=>$request->numero_retrait,
                        "type_paiement_id"=>$tarif["type_paiement_id"],
                        "mode_paiement_id"=>Mode_paiement::where("libelle","PAIEMENT WEB")->first()->id,
                        "etablissement_id"=>$tarif->etablissement_id,
                        "paiement_global_id"=>$paiementGlobal->id
                    ]);

                    $paiement->tarif()->associate(Tarif::find($tarif["id"]))->save();
                    $paiement->apprenant()->associate(Apprenant::find($apprenant["id"]))->save();

                   /* $resteApayer=$tarif["montant"]-$apprenant->paiements->where("type_paiement_id",$tarif["type_paiement_id"])->sum("montant");

                    $apprenant->tarifs()->syncWithoutDetaching([$tarif->id=>["resteApayer"=>$resteApayer]]);*/
                }
            }

            PaiementGlobal::where("id",$paiementGlobal->id)->first()->cashout();

            DB::commit();

            return redirect()->route('paiement.ok',["apprenantId"=>$apprenant->id,'total'=>$request->total]);
        }
        catch(Exception $e){
            DB::rollback();
            return $e;
        }

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function ok($apprenantId,$total)
    {

        $apprenant=Apprenant::where("id",$apprenantId)->with("classe.etablissement")->first();

        return Inertia::render("Paiement/Ok",["apprenant"=>$apprenant,"total"=>$total])->with("success","Paiement effectué avec succès");
    }
}
