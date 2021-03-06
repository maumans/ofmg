<?php

namespace App\Http\Controllers\Tuteur;

use App\Http\Controllers\Controller;
use App\Models\Apprenant;
use App\Models\Mode_paiement;
use App\Models\Paiement;
use App\Models\Tarif;
use App\Models\Type_paiement;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use function Sodium\add;

class PaiementController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $totalAll=0;
        $resteApayerAll=0;
        $payerAll=0;

        $tuteur=User::where('id',Auth::user()->id)->with(["paiementsTuteur"=>function($query){
            $query->orderByDesc('created_at')->with("apprenant","typePaiement","modePaiement","tarif")->get();
        },"tuteurApprenants"=>function($query){
            $query->with(["niveau.etablissement.anneeEnCours","tarifs.typePaiement","tarifs"=>function($query){
                $query->get();
            }])->get();
        }])->first();

        foreach($tuteur->tuteurApprenants as $apprenant)
        {
            foreach($apprenant->tarifs as $tarif)
            {
                $totalAll=$totalAll+$tarif->montant;
                $resteApayerAll=$resteApayerAll+$tarif->pivot->resteApayer;
            }
        }

        $payerAll=$totalAll-$resteApayerAll;

        $donneesParFrais= new Collection();

        foreach(Type_paiement::all() as $typePaiement)
        {
            $montant=$tuteur->tuteurApprenants->sum(function($apprenant) use ($typePaiement){
                return $apprenant->tarifs()->where("type_paiement_id",$typePaiement->id)->first()?$apprenant->tarifs()->where("type_paiement_id",$typePaiement->id)->first()->montant:0;
            });

            $resteApayer=$tuteur->tuteurApprenants->sum(function($apprenant) use ($typePaiement){
                return $apprenant->tarifs()->where("type_paiement_id",$typePaiement->id)->first()?$apprenant->tarifs()->where("type_paiement_id",$typePaiement->id)->first()->pivot->resteApayer:0;
            });


            if($montant)
            {
                $donneesParFrais->push(["libelle"=>$typePaiement->libelle,"montant"=>$montant,"resteApayer"=>$resteApayer,"payer"=>$montant-$resteApayer]);
            }
        }
        return Inertia::render("Tuteur/Paiement/Index",["tuteur"=>$tuteur,"resteApayerAll"=>$resteApayerAll,"totalAll"=>$totalAll,"payerAll"=>$payerAll,"donneesParFrais"=>$donneesParFrais]);
    }

    public function search($userId,$matricule)
    {


        $apprenant=Apprenant::where("matricule",$matricule)->first();

        $etablissement=$apprenant ? $apprenant->niveau->etablissement:null;

        $anneeEnCours=$etablissement ? $etablissement->anneeScolaires->last():null;

        $apprenant=$apprenant ? Apprenant::where("matricule",$matricule)->with(["tarifs"=>function($query){
            $query->with("typePaiement")->get();
        },"niveau"=>function($query){
            $query->with(["tarifs"=>function($query){
                $query->with("typePaiement")->get();
            },'etablissement']);
        },
            "paiements"=>function($query) use ($anneeEnCours,$apprenant){
                $query->whereHas("tarif",function ($query) use ($anneeEnCours,$apprenant){
                    $query->where('annee_scolaire_id', $anneeEnCours->id);
                })->with("typePaiement","tarif")->get();

            }
        ])->first():$apprenant;

        $nbrMois=$anneeEnCours ? Carbon::parse($anneeEnCours->dateFin)->diffInMonths(Carbon::parse($anneeEnCours->dateDebut)):null;

        $apprenant && $apprenant->tarifs->map(function($tarif) use($apprenant){

            $tarif->resteApayer=$tarif->montant-$apprenant->paiements->where("type_paiement_id",$tarif->typePaiement->id)->sum("montant");
        });



        $paiements=$apprenant ? $apprenant->paiements()->with("tarif","typePaiement")->get()->unique('type_paiement_id'):null;

        $apprenant ?  $paiements->map(function($paiement) use ($apprenant)
        {
            $paiement->resteApayer=$paiement->tarif->montant-$apprenant->paiements->where("type_paiement_id",$paiement->tarif->typePaiement->id)->sum("montant");
        }):null;

        $tuteur=User::where('id',Auth::user()->id)->with(["paiementsTuteur"=>function($query){
            $query->orderByDesc('created_at')->with("apprenant","typePaiement","modePaiement","tarif")->get();
        }])->first();

        $modePaiements=Mode_paiement::where("libelle","!=","OM");

        return Inertia::render("Tuteur/Paiement/Create",["etablissement"=>$etablissement,"apprenant"=>$apprenant,"matricule"=>$matricule,"nbrMois"=>$nbrMois,"modePaiements"=>$modePaiements,"paiements"=>$paiements,"tuteur"=>$tuteur]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $tuteur=User::where('id',Auth::user()->id)->with(["paiementsTuteur"=>function($query){
            $query->orderByDesc('created_at')->with("apprenant","typePaiement","modePaiement","tarif")->get();
        }])->first();

        return Inertia::render("Tuteur/Paiement/Create",["tuteur"=>$tuteur]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {

        foreach ($request->tarifs as $key =>$value)
        {
            $info=explode("_",$key);
            $apprenant=Apprenant::find($info[0]);
            $tarif=Tarif::find($info[1]);

            if($value)
            {

                $paiement=Paiement::create([
                    "montant"=>$request->montants[$info[0]."_".$info[1]],
                    "numero_retrait"=>$request->numero_retrait,
                    "type_paiement_id"=>$tarif["type_paiement_id"],
                    "mode_paiement_id"=>Mode_paiement::where("libelle","OM")->first()->id,
                    "tuteur_id"=>Auth::user()->id,
                ]);

                //Paiement::where("id",$paiement->id)->first()->cashin();

                $paiement->tarif()->associate(Tarif::find($tarif["id"]))->save();
                $paiement->apprenant()->associate(Apprenant::find($apprenant["id"]))->save();

                $resteApayer=$tarif["montant"]-$apprenant->paiements->where("type_paiement_id",$tarif["type_paiement_id"])->sum("montant");

                $apprenant->tarifs()->syncWithoutDetaching([$tarif->id=>["resteApayer"=>$resteApayer]]);
            }
        }

        return redirect()->route('tuteur.paiement.ok',['total'=>$request->total]);


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

    public function ok($total)
    {

        $tuteur=User::where('id',Auth::user()->id)->with(["paiementsTuteur"=>function($query){
            $query->orderByDesc('created_at')->with("apprenant","typePaiement","modePaiement","tarif")->get();
        },"tuteurApprenants"=>function($query){
            $query->with(["niveau.etablissement.anneeEnCours","tarifs.typePaiement","tarifs"=>function($query){
                $query->get();
            }])->get();
        }])->first();

        return Inertia::render("Tuteur/Paiement/Ok",["tuteur"=>$tuteur,"total"=>$total])->with("success","Paiement effectu?? avec succ??s");
    }
}
