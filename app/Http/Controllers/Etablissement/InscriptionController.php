<?php

namespace App\Http\Controllers\Etablissement;

use App\Http\Controllers\Controller;
use App\Models\Apprenant;
use App\Models\Inscription;
use App\Models\Niveau;
use App\Models\Tarif;
use App\Models\Ville;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class InscriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $niveaux=Auth::user()->etablissementAdmin->niveaux()->with("tarifs",function ($query){
            $query->with("typePaiement")->get();
        })->get();

        $villes=Ville::all();
        $anneeEnCours=Auth::user()->etablissementAdmin->anneeScolaires->last();

        //$tarifsInscription=Auth::user()->etablissementAdmin->tarifs()->where("annee_scolaire_id",$anneeEnCours->id)->whereRelation('typePaiement',"libelle","INSCRIPTION")->get();

        $tarifs=Auth::user()->etablissementAdmin->tarifs()->where("annee_scolaire_id",$anneeEnCours->id)->with("typePaiement")->get();


        //$inscriptions=Auth::user()->etablissementAdmin->anneeScolaires()->with("inscriptions")->get();

        $inscriptions=Inscription::whereRelation('niveau',"etablissement_id",Auth::user()->etablissementAdmin->id)->with("apprenant","niveau")->get();

        return Inertia::render('Etablissement/Inscription/Index',["niveaux"=>$niveaux,"villes"=>$villes,"tarifs"=>$tarifs,"anneeEnCours"=>$anneeEnCours,"inscriptions"=>$inscriptions]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {

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
            "nom" =>"required",
            "prenom" =>"required",
            "matricule" =>"required",
            "lieuNaissance" =>"required",
            "dateNaissance" =>"required",
            "niveau" =>"required",
            "prenomTuteur" =>"required",
            "nomTuteur" =>"required",
            "telephoneTuteur" =>"required",
        ]);


        DB::beginTransaction();

       try{
           $inscription=Inscription::create([
               "montant" =>$request->montant,
               "typePaiement.libelle"=>["required",Rule::unique("tarifs")->where(function($query) use ($request) {
                   return $query->where("etablissement_id",Auth::user()->etablissementAdmin->id)->where("typePaiement_id",$request->typePaiement["id"])->where("niveau_id",$request->niveau["id"]);
               })],
           ]);

           $apprenant=Apprenant::create([
               "nom" =>$request->nom,
               "prenom" =>$request->prenom,
               "matricule" =>$request->matricule,
               "niveau_id" =>$request->niveau["id"],
               "date_naissance" =>$request->dateNaissance,
               "lieu_naissance" =>$request->lieuNaissance,
               "prenomTuteur" =>$request->prenomTuteur,
               "nomTuteur" =>$request->nomTuteur,
               "emailTuteur" =>$request->emailTuteur,
               "telephoneTuteur" =>$request->telephoneTuteur,
           ]);

           $anneeEnCours=Auth::user()->etablissementAdmin->anneeScolaires->last();


           $inscription->niveau()->associate(Niveau::find($request->niveau["id"]))->save();
           $inscription->apprenant()->associate($apprenant)->save();
           $inscription->anneeScolaire()->associate($anneeEnCours)->save();

           foreach($request->tarifs as $key=>$value){
               if($value)
               {
                   $apprenant->tarifs()->syncWithoutDetaching(Tarif::find($key));
               }
           }


           DB::commit();

           return redirect()->back();

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
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id, Inscription $inscription)
    {
        $inscription->delete();

        return redirect()->back();
    }
}
