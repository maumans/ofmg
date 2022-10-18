<?php

namespace App\Http\Controllers\Etablissement;

use App\Http\Controllers\Controller;
use App\Models\Apprenant;
use App\Models\Code_numero;
use App\Models\Mode_paiement;
use App\Models\Mois;
use App\Models\Mois_Paye;
use App\Models\Classe;
use App\Models\Paiement;
use App\Models\Tarif;
use App\Models\User;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PaiementController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $paiements=Paiement::whereRelation("tarif.etablissement","id",Auth::user()->etablissementAdmin->id)->with("apprenant","typePaiement","modePaiement")->orderByDesc('created_at')->get();

        return Inertia::render('Etablissement/Paiement/Index',["paiements"=>$paiements]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Inertia\Response
     */
    public function search(Request $request,$userId)
    {
        $matricule=$request->matricule;
        $tuteurNumber=$request->tuteurNumber;

        $apprenants=null;
        $tuteurApprenants=null;
        $tuteur=null;
        $apprenant=null;

        if($request->classeId)
        {
            $classe=Classe::where("id",$request->classeId)->first();

            $apprenants=$classe ? $classe->apprenants()->with("classe")->orderByDesc("created_at")->get() : null;
        }
        else if ($tuteurNumber)
        {
            $apprenant=null;

            $tuteur=User::where("telephone",$tuteurNumber)->with(["paiementsTuteur"=>function($query){
                $query->orderByDesc('created_at')->with("apprenant","typePaiement","modePaiement","tarif")->get();
            },"tuteurApprenants"=>function($query){
                $query->with(["classe.etablissement.anneeEnCours","tarifs.typePaiement","tarifs"=>function($query){
                    $query->get();
                }])->get();
            }])->first();
        }
        else if($matricule)
        {

            $apprenant=Apprenant::where("matricule",$matricule)->first();

            $etablissement=$apprenant ? $apprenant->classe->etablissement:null;

            $anneeEnCours=$etablissement ? $etablissement->anneeScolaires->last():null;

            $apprenant=$apprenant ? Apprenant::where("matricule",$matricule)->with(["tarifs"=>function($query){
                $query->with("typePaiement")->get();
            },"classe"=>function($query){
                $query->with(["tarifs"=>function($query){
                    $query->with("typePaiement")->get();
                },"etablissement"]);
            },
                "paiements"=>function($query) use ($anneeEnCours,$apprenant){
                    $query->whereHas("tarif",function ($query) use ($anneeEnCours,$apprenant){
                        $query->where('annee_scolaire_id', $anneeEnCours->id);
                    })->with("typePaiement","tarif")->get();

                }
            ,"tuteurs"])->first():$apprenant;
        }

        $modePaiements=Mode_paiement::all();
        $classes=Classe::where('etablissement_id',Auth::user()->etablissementAdmin->id)->with("apprenants")->get();


        return ["apprenant"=>$apprenant,"matricule"=>$matricule,"modePaiements"=>$modePaiements,"classes"=>$classes,"apprenants"=>$apprenants,"tuteur"=>$tuteur];
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $codeNumeros=Code_numero::all();

        $classes=Classe::where('etablissement_id',Auth::user()->etablissementAdmin->id)->with("apprenants")->get();

        //dd(Auth::user()->etablissementAdmin->id);

        $apprenants=Apprenant::whereRelation("classe.etablissement","id",Auth::user()->etablissementAdmin->id)->with("classe")->orderByDesc('created_at')->get();


        return Inertia::render("Etablissement/Paiement/Create",["classes"=>$classes,"apprenants"=>$apprenants,"codeNumeros"=>$codeNumeros]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            "tarifs"=>"required",
            "montants.*"=>"required",
            "total"=>"required",
        ],
        [
            "tuteurSelectedId.required"=>"Veuillez selectionner un tuteur",
        ]);


        DB::beginTransaction();

        try{

            foreach ($request->tarifs as $key =>$value)
            {
                $info=explode("_",$key);
                $apprenant=Apprenant::find($info[0]);
                $tarif=Tarif::find($info[1]);

                if($value)
                {
                    $paiement=Paiement::create([
                        "montant"=>$request->montants[$info[0]."_".$info[1]],
                        "type_paiement_id"=>$tarif["type_paiement_id"],
                        "mode_paiement_id"=>Mode_paiement::where("libelle","CASH")->first()->id,
                        "tuteur_id"=>$request->tuteurSelectedId,
                        "etablissement_id"=>$tarif->etablissement_id
                    ]);


                    Paiement::where("id",$paiement->id)->first()->cashin();

                    $paiement->tarif()->associate($tarif->id)->save();
                    $paiement->apprenant()->associate($apprenant)->save();

                    $resteApayer=$tarif["montant"]-$apprenant->paiements->where("tarif_id",$tarif->id)->sum("montant");

                    $apprenant->tarifs()->syncWithoutDetaching([$tarif->id=>["resteApayer"=>$resteApayer]]);
                }
            }

            foreach($apprenant->tarifs as $tarif)
            {
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

            DB::commit();

            return redirect()->route("etablissement.paiement.index",["etablissement"=>Auth::user()->etablissementAdmin->id])->with(["success"=>"Paiements effectués","montantTotal"=>$request->total]);
        }
        catch(Exception $e){

            echo($e);
            DB::rollback();
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
}
