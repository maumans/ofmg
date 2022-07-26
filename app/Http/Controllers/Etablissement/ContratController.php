<?php

namespace App\Http\Controllers\Etablissement;

use App\Http\Controllers\Controller;
use App\Models\Apprenant_tarif;
use App\Models\Classe;
use App\Models\Contrat;
use App\Models\Contrat_fonction;
use App\Models\Contrat_fonction_mois;
use App\Models\Cours;
use App\Models\Fonction;
use App\Models\Matiere;
use App\Models\Mois;
use App\Models\Mois_Paye;
use App\Models\Personnel;
use App\Models\Role;
use App\Models\User;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ContratController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users=User::has("contrats.contratFonctions")->whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->with(["contrats"=>function($query){
            $query->with("contratFonctions.fonction","anneeScolaire","contratFonctions.anneeScolaire","user","contratFonctions.cours.matiere","contratFonctions.cours.classe")->orderByDesc("created_at")->get();
        }])->orderByDesc('created_at')->get();

        return Inertia::render("Etablissement/Contrat/Index",["users"=>$users]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $fonctions=Fonction::all();

        $classes=Classe::all();
        $matieres=Matiere::all();

        return Inertia::render("Etablissement/Contrat/Create",["fonctions"=>$fonctions,"matieres"=>$matieres,"classes"=>$classes]);
    }

    public function search(Request $request,$userId)
    {
        $personnels=User::where(function($query) use ($request){
            $query->where("prenom","like","%".$request->search."%")->orWhere("nom","like","%".$request->search."%")->orWhere("telephone","like","%".$request->search."%")->get();
        })->whereRelation("roles","libelle","personnel")->whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->with(["contratFonctions"=>function($query){
            $query->whereRelation("anneeScolaire","id",Auth::user()->etablissementAdmin->anneeEnCours->id)->with(["fonction"=>function($query){
                $query->get();
            }])->get();
        }])->orderByDesc("created_at")->get();


        return $personnels;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        DB::beginTransaction();

        try{

            if (!$request->personnel)
            {
                if(strtolower($request->fonction["libelle"])=="directeur" || strtolower($request->fonction["libelle"])=="comptable")
                {
                    $request->validate([
                        "nom" =>"required|min:1",
                        "prenom" =>"required|min:1",
                        "telephone" =>"required|min:1",
                        "adresse" =>"required",
                        "email" =>"required|min:1|email|unique:users",
                        "password" =>"required",
                        "niveauValidation"=>strtolower($request->fonction["libelle"])=="comptable" ?"required":""
                    ]);
                }
                else
                {
                    $request->validate([
                        "nom" =>"required|min:1",
                        "prenom" =>"required|min:1",
                        "telephone" =>"required|min:1",
                        "adresse" =>"required",
                    ]);
                }

                $user=User::create([
                    "nom" =>$request->nom,
                    "prenom" =>$request->prenom,
                    "telephone" =>$request->telephone,
                    "adresse" =>$request->adresse,
                    "email" =>$request->email,
                    "password" =>Hash::make($request->password),
                ]);
            }
            else
            {
                if(strtolower($request->fonction["libelle"])=="comptable" || strtolower($request->fonction["libelle"])=="directeur")
                {
                    $request->validate([
                        "email" =>"required|min:1|email|unique:users",
                        "password" =>"required",
                    ]);
                }

                $user=User::find($request->personnel["id"]);

                $user->email=$request->email;
                $user->password=$request->password;

                if(strtolower($request->fonction["libelle"])=="comptable")
                {
                    $user->niveauValidation=$request->niveauValidation;
                }
                $user->save();
            }



            $user->etablissement()->associate(Auth::user()->etablissementAdmin->id)->save();

            $user->roles()->syncWithoutDetaching(Role::where("libelle","personnel")->first());

            $anneeScolaire=Auth::user()->etablissementAdmin->anneeEnCours;

            if ($user->contratEnCours)
            {
                $contrat=$user->contratEnCours;
            }
            else
            {
                $contrat=Contrat::create([
                    "dateDebut"=>Carbon::now(),
                    "annee_scolaire_id" =>$anneeScolaire->id,
                    "user_id" =>$user->id,
                    "etablissement_id"=>Auth::user()->etablissementAdmin->id,
                ]);

                $user->contratEnCours()->associate($contrat)->save();
            }

            if(strtolower($request->fonction["libelle"])==="comptable")
            {
                $user->update([
                    'niveauValidation'=>$request->niveauValidation
                ]);
            }


            if(strtolower($request->fonction["libelle"])=="enseignant")
            {
                foreach($request->coursList as $cours)
                {


                    $cours=Cours::create([
                        "montant" =>$cours["montant"],
                        "frequence"=>$cours["frequence"],
                        "contrat_id"=>$contrat->id,
                        "personnel_id" =>$user->id,
                        "classe_id" =>$cours["classe"]["id"],
                        "matiere_id" =>$cours["matiere"]["id"],
                        "annee_scolaire_id" =>$anneeScolaire->id
                    ]);

                    $contratFonction=Contrat_fonction::create([
                        "montant" =>$cours["montant"],
                        "frequence"=>$cours["frequence"],
                        "contrat_id"=>$contrat->id,
                        "fonction_id"=>$request->fonction["id"],
                        "annee_scolaire_id"=>$anneeScolaire->id,
                        "user_id" =>$user->id,
                        "cours_id"=>$cours["id"],
                    ]);

                    $intervalle=CarbonPeriod::create($anneeScolaire->dateDebut,"1 month",$anneeScolaire->dateFin);

                    foreach($intervalle as $date)
                    {
                        $contratFonctionMois=Contrat_fonction_mois::create([
                            "montant"=>0,
                            "nombreHeures" =>0
                        ]);

                        $contratFonctionMois->mois()->associate(Mois::where("position",$date->month)->first())->save();
                        $contratFonctionMois->contratFonction()->associate(Contrat_fonction::where("id",$contratFonction->id)->first())->save();

                    }
                }

            }
            else
            {
                $contratFonction=Contrat_fonction::create([
                    "montant" =>$request->montant,
                    "frequence"=>$request->frequence,
                    "contrat_id"=>$contrat->id,
                    "fonction_id"=>$request->fonction["id"],
                    "annee_scolaire_id"=>$anneeScolaire->id,
                    "user_id" =>$user->id,
                ]);

                $intervalle=CarbonPeriod::create($anneeScolaire->dateDebut,"1 month",$anneeScolaire->dateFin);

                foreach($intervalle as $date)
                {
                    $contratFonctionMois=Contrat_fonction_mois::create([
                        "montant"=>0,
                        "nombreHeures" =>0,
                    ]);

                    $contratFonctionMois->mois()->associate(Mois::where("position",$date->month)->first())->save();
                    $contratFonctionMois->contratFonction()->associate(Contrat_fonction::where("id",$contratFonction->id)->first())->save();
                    $contratFonctionMois->personnel()->associate(Personnel::where("id",$user->id)->first())->save();

                }
            }

            DB::commit();

            return redirect()->route('etablissement.contrat.index',["etablissement"=>Auth::user()->id])->with("success","Contrat créé avec succès");

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
