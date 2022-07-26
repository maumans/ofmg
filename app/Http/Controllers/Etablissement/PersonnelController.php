<?php

namespace App\Http\Controllers\Etablissement;

use App\Http\Controllers\Controller;
use App\Models\Contrat_fonction;
use App\Models\Contrat_fonction_mois;
use App\Models\Fonction;
use App\Models\Mois;
use App\Models\Mois_Paye;
use App\Models\Paiement;
use App\Models\Personnel;
use App\Models\Salaire;
use App\Models\User;
use Carbon\CarbonPeriod;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PersonnelController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $personnels=User::has("contrats.contratFonctions")->whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->with(["contrats"=>function($query){
            $query->with("contratFonctions.fonction","anneeScolaire","user")->orderByDesc("created_at")->get();
        }])->orderByDesc("created_at")->get();

        return Inertia::render('Etablissement/Personnel/Index',["personnels"=>$personnels]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $fonctions=Fonction::whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->get();

        return Inertia::render('Etablissement/Personnel/Create',["fonctions"=>$fonctions]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {

        $personnel=User::create($request->validate([
            "prenom" =>"required",
            "nom" =>"required",
            "adresse" =>"required",
            "telephone" =>"required",
        ]));

        $personnel->etablissement()->associate(Auth::user()->etablissementAdmin)->save();

        return redirect()->route('etablissement.personnel.index',["etablissement"=>Auth::user()->etablissementAdmin->id])->with("success","Personnel ajouté avec succès");
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($userId,$id)
    {
        $personnel=User::where("id",$id)->with(["contratEnCours.contratFonctions"=>function($query){
            $query->with("fonction","anneeScolaire","cours.matiere","cours.classe","contratFonctionMois.mois")->get();
        }])->first();

        $mois=Mois::all();

        //dd($personnel->contratEnCours->contratFonctions);

        return Inertia::render("Etablissement/Personnel/Show",["personnel"=>$personnel,"mois"=>$mois]);
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

    public function salaire()
    {

        $anneeEnCours=Auth::user()->etablissementAdmin->anneeEnCours;

        $intervalle=CarbonPeriod::create($anneeEnCours->dateDebut,"1 month",$anneeEnCours->dateFin);

        $mois=collect();

        foreach($intervalle as $date)
        {
            $mois->push(Mois::where("position",$date->month)->first());
        }

        $personnels=User::whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->whereRelation("roles","libelle","personnel")->with("salaires.mois","contratFonctionMois.mois")->orderByDesc("created_at")->get();

        foreach($personnels as $personnel)
        {
            $salairesCl=collect();
            foreach(Mois::all() as $ms)
            {
                $horaire=Contrat_fonction_mois::where("mois_id",$ms->id)->where("user_id",$personnel->id)->whereRelation("contratFonction.anneeScolaire","id",Auth::user()->etablissementAdmin->anneeEnCours->id)->get()->sum("salaire");

                $mensuelle=Contrat_fonction::where("user_id",$personnel->id)->where("frequence","MENSUELLE")->whereRelation("anneeScolaire","id",Auth::user()->etablissementAdmin->anneeEnCours->id)->get()->sum("montant");

                $salairesCl->push(["mois"=>$ms, "salaire"=>$horaire+$mensuelle]);
            }

            $personnel->salairesAp=$salairesCl;
        }

        $salaires=Salaire::whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->where("niveauValidation",1)->with("personnel","mois","anneeScolaire")->where("niveauValidation",1)->orderByDesc('id')->get();


        return Inertia::render('Etablissement/Personnel/Salaire',["personnels"=>$personnels,"mois"=>$mois,"anneeEnCours"=>$anneeEnCours,"salaires"=>$salaires]);
    }

    public function salaireStore(Request $request,$user,$mois)
    {

        $request->validate([
            "mois"=>$mois
        ]);

        DB::beginTransaction();

        try{

            foreach($request->all() as $key => $value)
            {
                $salaire=Salaire::create([
                    "numero_depot"=>User::find($key)->telephone,
                    "numero_retrait"=>"621889677",
                    "montant"=>$value,
                    "mois_id"=>$mois,
                    "etablissement_id"=>Auth::user()->etablissementAdmin->id,
                    "annee_scolaire_id"=>Auth::user()->etablissementAdmin->anneeEnCours->id,
                    "personnel_id"=>$key
                ]);
            }
            DB::commit();

            return redirect()->route('etablissement.personnel.paiement.historique',["userId"=>Auth::user()->id,"ok"=>true])->with('success',"Salaire payés avec succés");
        }
        catch(Exception $e){

            echo($e);
            DB::rollback();
        }
    }

    public function historique($user,$ok=null)
    {
        $salaires=Salaire::where('status',"VALIDE")->whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->with("personnel","mois")->orderByDesc('id')->get();

        return Inertia::render('Etablissement/Personnel/Historique',["salaires"=>$salaires]);
    }

    public function validationSalaire()
    {
        $salaires=Salaire::whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->where("niveauValidation",1)->with("personnel","mois","anneeScolaire")->where("niveauValidation",1)->orderByDesc('id')->get();

        return Inertia::render('Etablissement/Personnel/Validation',["salaires"=>$salaires]);
    }

    public function validationStore(Request $request,$user)
    {

        DB::beginTransaction();

        try{
            foreach($request->all() as $salaire)
            {
                $s=Salaire::where("id",$salaire["id"])->first();


                $s->update([
                    "niveauValidation"=>2,
                    "status"=>"VALIDE",
                ]);
                //Salaire::where("id",$salaire->id)->first()->cashout();

            }
            DB::commit();

            return Inertia::render("Etablissement/Personnel/ValidationOk");
        }
        catch(Exception $e){
            echo($e);
            DB::rollback();
        }

    }

    public function validationCancel(Request $request,$user)
    {
        DB::beginTransaction();

        try{
            $salaire=Salaire::find($request->salaireId);
            $salaire->motifAnnulation=$request->motifAnnulation;
            $salaire->status="ANNULE";
            $salaire->niveauValidation=1;
            $salaire->save();
            DB::commit();

            return redirect()->back()->with("success","Paiement annulé avec succès");
        }
        catch(Exception $e){
            echo($e);
            DB::rollback();
        }

    }


}
