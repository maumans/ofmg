<?php

namespace App\Http\Controllers\Etablissement;

use App\Http\Controllers\Controller;
use App\Models\Apprenant;
use App\Models\Mode_paiement;
use App\Models\Niveau;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        //
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

        if(!$matricule)
        {
            $niveau=Niveau::where("id",$request->niveauId)->first();

            $apprenants=$niveau ? $niveau->apprenants:null;

        }

        if ($tuteurNumber)
        {
            $apprenant=null;

            $tuteur=User::where("telephone",$tuteurNumber)->with(["paiementsTuteur"=>function($query){
                $query->orderByDesc('created_at')->with("apprenant","typePaiement","modePaiement","tarif")->get();
            },"tuteurApprenants"=>function($query){
                $query->with(["niveau.etablissement.anneeEnCours","tarifs.typePaiement","tarifs"=>function($query){
                    $query->get();
                }])->get();
            }])->first();
        }

        if($matricule)
        {
            $apprenant=Apprenant::where("matricule",$matricule)->first();

            $etablissement=$apprenant ? $apprenant->niveau->etablissement:null;

            $anneeEnCours=$etablissement ? $etablissement->anneeScolaires->last():null;

            $apprenant=$apprenant ? Apprenant::where("matricule",$matricule)->with(["tarifs"=>function($query){
                $query->with("typePaiement")->get();
            },"niveau"=>function($query){
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
        $niveaux=Niveau::where('etablissement_id',Auth::user()->etablissementAdmin->id)->with("apprenants")->get();


        return ["apprenant"=>$apprenant,"matricule"=>$matricule,"modePaiements"=>$modePaiements,"niveaux"=>$niveaux,"apprenants"=>$apprenants,"tuteur"=>$tuteur];
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $niveaux=Niveau::where('etablissement_id',Auth::user()->etablissementAdmin->id)->with("apprenants")->get();

        return Inertia::render("Etablissement/Paiement/Create",["niveaux"=>$niveaux]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
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
