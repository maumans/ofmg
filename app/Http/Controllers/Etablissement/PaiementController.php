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
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PaiementController extends Controller
{

    public function __construct()
    {
        $this->middleware('anneeScolaireIsDefined')->only('create');
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $paiements=Paiement::whereRelation("tarif.etablissement","id",Auth::user()->etablissementAdmin->id)->with("apprenant","typePaiement","modePaiement",'paiementGlobal')->orderByDesc('created_at')->get();

        return Inertia::render('Etablissement/Paiement/Index',["paiements"=>$paiements]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Inertia\Response
     */
    public function search(Request $request,$userId)
    {
        $searchText=$request->searchText;

        if(Auth::user()->etablissementAdmin->anneeEnCours)
        {

            $anneeEnCours=Auth::user()->etablissementAdmin->anneeEnCours;

            $apprenants = Apprenant::where(function ($query) use ($request){
                if ($request->classeId)
                {
                    $query->where('classe_id',$request->classeId);
                }
            })->where(function ($query) use($searchText){
                $query->where("matricule",'like',"%".$searchText."%")->orWhere("nom",'like',"%".$searchText."%")->orWhere("prenom",'like',"%".$searchText."%");
            })->with(["tarifs"=>function($query){
                    $query->with("typePaiement")->get();
                },"classe"=>function($query){
                    $query->with(["tarifs"=>function($query){
                        $query->with("typePaiement")->get();
                    },"etablissement"]);
                },
                    "paiements"=>function($query) use ($anneeEnCours){
                        $query->whereHas("tarif",function ($query) use ($anneeEnCours){
                            $query->where('annee_scolaire_id', $anneeEnCours->id);
                        })->with("typePaiement","tarif")->get();

                    }
                    ,"tuteurs"]
            )->get();

        }

        return ["apprenants"=>$apprenants/*,"matricule"=>$matricule,"modePaiements"=>$modePaiements,"classes"=>$classes,"apprenant"=>$apprenant*/ /*,"tuteur"=>$tuteur*/];
    }


    public function filtre(Request $request)
    {
        $date_debut = Carbon::parse($request->get('dateDebut'))->startOfDay();
        $date_fin = Carbon::parse($request->get('dateFin'))->endOfDay();

        $paiements=Paiement::whereRelation("tarif.etablissement","id",Auth::user()->etablissementAdmin->id)
            ->with("apprenant","typePaiement","modePaiement",'paiementGlobal')
            ->whereBetween('created_at',[$date_debut,$date_fin])->orderByDesc('created_at')->get();

        return $paiements;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        //dd(1);
        $codeNumeros=Code_numero::all();

        $classes=Classe::where('etablissement_id',Auth::user()->etablissementAdmin->id)->with("apprenants")->get();

        $anneeEnCours=Auth::user()->etablissementAdmin->anneeEnCours;

        $apprenants=Apprenant::whereRelation("classe.etablissement","id",Auth::user()->etablissementAdmin->id)->whereRelation("inscriptions",function ($query){
            $query->whereRelation("anneeScolaire",'id',Auth::user()->etablissementAdmin->anneeEncours->id,)->where('status',true);
        })->whereRelation("tarifs",function($query) use($anneeEnCours){
            $query->whereRelation('anneeScolaire','id', $anneeEnCours->id)->where('tarifs.status',true)->with("typePaiement");
        })->with("classe")->orderByDesc('created_at')->get();


        return Inertia::render("Etablissement/Paiement/Create",["classes"=>$classes,"apprenants"=>$apprenants,"codeNumeros"=>$codeNumeros]);
    }

    public function tarif($etablissementId,$id)
    {
        $codeNumeros=Code_numero::all();

        $apprenant=Apprenant::where("id",$id)->first();

        $etablissement=$apprenant ? $apprenant->classe->etablissement:null;

        $anneeEnCours=$etablissement->anneeEnCours;

        $apprenant=$apprenant ? Apprenant::where("id",$id)->with(["tarifs"=>function($query) use($anneeEnCours){
            $query->whereRelation('anneeScolaire','id', $anneeEnCours->id)->where('tarifs.status',true)->with("typePaiement");
        },"classe"=>function($query) use ($anneeEnCours){
            $query->with(["tarifs"=>function($query) use ($anneeEnCours){
                $query->whereRelation('anneeScolaire','id', $anneeEnCours->id)->where('status',true)->with("typePaiement");
            },"etablissement"]);
        },
            "paiements"=>function($query) use ($anneeEnCours,$apprenant){
                $query->whereHas("tarif",function ($query) use ($anneeEnCours,$apprenant){
                    $query->whereRelation('anneeScolaire','id', $anneeEnCours->id)->where('status',true);
                })->with("typePaiement","tarif")->get();

            }
            ,"tuteurs"])->first():$apprenant;


        $modePaiements=Mode_paiement::all();

        //dd($apprenant);

        return Inertia::render("Etablissement/Paiement/Tarif",["modePaiements"=>$modePaiements,"apprenant"=>$apprenant,"codeNumeros"=>$codeNumeros]);
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
            "et"
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
                        "mode_paiement_id"=>Mode_paiement::where("libelle","PAIEMENT CASH")->first()->id,
                        "tuteur_id"=>$request->tuteurSelectedId,
                        "etablissement_id"=>$tarif->etablissement_id
                    ]);


                    //Paiement::where("id",$paiement->id)->first()->cashin();

                    $paiement->tarif()->associate($tarif->id)->save();
                    $paiement->apprenant()->associate($apprenant)->save();

                    $resteApayer=$tarif["montant"]-$apprenant->paiements->where("tarif_id",$tarif->id)->sum("montant");

                    $apprenant->tarifs()->syncWithoutDetaching([$tarif->id=>["resteApayer"=>$resteApayer]]);
                }
            }

            foreach($apprenant->tarifs as $tarif)
            {
                $payeParTarif=$apprenant->paiements->where("tarif_id",$tarif->id)->sum("montant");

                $intervalle=CarbonPeriod::create($tarif->anneeScolaire->dateDebut,"1 month",$tarif->anneeScolaire->dateFin)->roundMonth();

                $nombreMois=$intervalle->count();

                $sommeMensuelle=$tarif->montant/$nombreMois;

                $repartition=$payeParTarif;

                //dd($payeParTarif,$sommeMensuelle,$tarif->montant);


                if (strtolower($tarif->frequence) == strtolower('MENSUELLE'))
                {
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

            return redirect()->route('etablissement.paiement.index',[Auth::id()])->with(["success"=>"Paiements effectués","montantTotal"=>$request->total]);
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
