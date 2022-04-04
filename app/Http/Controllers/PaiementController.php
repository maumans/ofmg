<?php

namespace App\Http\Controllers;

use App\Models\Apprenant;
use App\Models\Etablissement;
use App\Models\Mode_paiement;
use App\Models\Paiement;
use App\Models\Tarif;
use App\Models\Type_paiement;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

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

    public function search($matricule)
    {

        $apprenant=Apprenant::where("matricule",$matricule)->first();

        $etablissement=$apprenant ? $apprenant->niveau->etablissement:null;

        $anneeEnCours=$etablissement ? $etablissement->anneeScolaires->last():null;

        $apprenant=$apprenant ? Apprenant::where("matricule",$matricule)->with(["tarifs"=>function($query){
            $query->with("typePaiement")->get();
        },"niveau"=>function($query){
            $query->with(["tarifs"=>function($query){
                $query->with("typePaiement")->get();
            }]);
        },
           "paiements"=>function($query) use ($anneeEnCours,$apprenant){
          $query->whereHas("tarif",function ($query) use ($anneeEnCours,$apprenant){
              $query->where('annee_scolaire_id', $anneeEnCours->id);
          })->with("typePaiement","tarif")->get();

        }
        ])->first():$apprenant;

        $nbrMois=$anneeEnCours ? Carbon::parse($anneeEnCours->dateFin)->diffInMonths(Carbon::parse($anneeEnCours->dateDebut)):null;

        $apprenant && $apprenant->niveau->tarifs->map(function($tarif) use($apprenant){

          $tarif->resteApayer=$tarif->montant-$apprenant->paiements->where("type_paiement_id",$tarif->typePaiement->id)->sum("montant");
        });



        $paiements=$apprenant ? $apprenant->paiements()->with("tarif","typePaiement")->get()->unique('type_paiement_id'):null;

        $apprenant ?  $paiements->map(function($paiement) use ($apprenant)
        {
            $paiement->resteApayer=$paiement->tarif->montant-$apprenant->paiements->where("type_paiement_id",$paiement->tarif->typePaiement->id)->sum("montant");
        }):null;


        $modePaiements=Mode_paiement::all();

        $tuteur=User::where('id',Auth::user()->id)->with(["paiementsTuteur"=>function($query){
            $query->orderByDesc('created_at')->with("apprenant","typePaiement","modePaiement","tarif")->get();
        }])->first();

        return Inertia::render("Paiement/Create",["etablissement"=>$etablissement,"apprenant"=>$apprenant,"matricule"=>$matricule,"nbrMois"=>$nbrMois,"modePaiements"=>$modePaiements,"paiements"=>$paiements,"tuteur"=>$tuteur]);
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

        return Inertia::render("Paiement/Create",["tuteur"=>$tuteur]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {

        dd($request->all());
        $request->validate([
            "montants.*" =>"required",
            "modes.*" =>"required"
        ],
        [
            "montants.*.required"=>"Le champs montant est obligatoire",
            "modes.*.required"=>"Le champs mode de paiement est obligatoire",
        ]
        );

        foreach($request->tarifs as $tarif)
        {

            $resteApayer=$tarif["montant"]-Apprenant::find($request->apprenant["id"])->paiements->where("type_paiement_id",$tarif["type_paiement_id"])->sum("montant");

            $request->validate([
                "montants.".$tarif["type_paiement_id"] =>"lte:".$resteApayer
            ],
            [
                "montants.*.lte"=>"Le montant etre doit inferieur ou egale à ".$resteApayer." FG"
            ]);
        }


        foreach ($request->tarifs as $tarif)
        {
            $paiement=Paiement::create([
                "montant"=>$request->montants[$tarif["type_paiement"]["id"]],
                "type_paiement_id"=>$tarif["type_paiement"]["id"],
                "mode_paiement_id"=>$request->modes[$tarif["type_paiement"]["id"]]["id"],
                "tuteur_id"=>Auth::user()->id
            ]);

            $paiement->tarif()->associate(Tarif::find($tarif["id"]))->save();
            $request->apprenant && $paiement->apprenant()->associate(Apprenant::find($request->apprenant["id"]))->save();
        }


        return redirect()->back()->with(["success"=>"Paiements effectués","montantTotal"=>$request->total]);


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
