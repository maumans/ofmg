<?php

namespace App\Http\Controllers\Etablissement;

use App\Http\Controllers\Controller;
use App\Models\Classe;
use App\Models\Code_numero;
use App\Models\Contrat;
use App\Models\Contrat_fonction;
use App\Models\Contrat_fonction_mois;
use App\Models\Cours;
use App\Models\Fonction;
use App\Models\Matiere;
use App\Models\Mois;
use App\Models\Mois_Paye;
use App\Models\Paiement;
use App\Models\Paiement_occasionnel;
use App\Models\Personnel;
use App\Models\Role;
use App\Models\Salaire;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PersonnelController extends Controller
{

    public function __construct()
    {
        $this->middleware('anneeScolaireIsDefined')->only('create','salaire');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {

        $personnels=User::has("contrats.contratFonctions")->whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->with(["contrats"=>function($query){
            $query->with("contratFonctions.fonction","anneeScolaire","user")->orderByDesc("created_at")->get();
        }])->where('status',"Actif")->orderByDesc("created_at")->get();

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
    public function edit($userId,$personnelId)
    {

        $anneeEnCours = Auth::user()->etablissementAdmin->anneeEnCours;

        $personnel = User::where('id',$personnelId)->where('status','Actif')
            ->with(['contratEnCours'=>function($query) use($anneeEnCours){
                $query->where('annee_scolaire_id',$anneeEnCours->id)->where('status',true);
            },
            'cours'=>function($query) use($anneeEnCours){
                $query->where('annee_scolaire_id',$anneeEnCours->id)->where('status',true)->with('classe','matiere');
            }
            ,'contratFonctions'=>function($query) use($anneeEnCours){
                $query->where('annee_scolaire_id',$anneeEnCours->id)->where('status',true)->with("contratFonctionMois");
            }])
            ->first();

        $fonctions = Fonction::where('status',true)->where(function ($query) use($anneeEnCours,$personnel){
            $query->whereDoesntHave('contratFonctions',function($query) use($anneeEnCours,$personnel){
                $query->where('annee_scolaire_id',$anneeEnCours->id)->where('user_id',$personnel->id);
            })->orWhere('libelle',"ENSEIGNANT");
        })->get();

        $connexion = $personnel->contratFonctions->contains(function($cf){
            return strtolower($cf->fonction->libelle) === strtolower('Comptable') || strtolower($cf->fonction->libelle) === strtolower('Directeur');
        });

        $enseignant = $personnel->contratFonctions->contains(function($cf){
            return strtolower($cf->fonction->libelle) === strtolower('Enseignant');
        });

        $directeur = $personnel->contratFonctions->contains(function($cf){
            return strtolower($cf->fonction->libelle) === strtolower('Directeur');
        });

        $comptable = $personnel->contratFonctions->contains(function($cf){
            return strtolower($cf->fonction->libelle) === strtolower('Comptable');
        });

        $classes=Classe::where('status',true)->get();
        $matieres=Matiere::where('status',true)->get();

        //dd($personnel->cours,$enseignant,$comptable,$directeur);


        return Inertia::render('Etablissement/Personnel/Edit',["fonctions"=>$fonctions,
            "personnel"=>$personnel,
            "classes"=>$classes,
            "matieres"=>$matieres,
            "connexion"=>$connexion,
            "enseignant"=>$enseignant,
            "directeur"=>$directeur,
            "comptable"=>$comptable,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request,$userId,User $personnel)
    {

        //dd($personnel->contratEnCours()->where("annee_scolaire_id",Auth::user()->etablissementAdmin->anneeEnCours)->where('status','true')->first());

        if (!$request->personnel)
        {
            if(strtolower($request->fonction["libelle"])=="directeur" || strtolower($request->fonction["libelle"])=="comptable")
            {
                $request->validate([
                    "nom" =>"required|min:1",
                    "prenom" =>"required|min:1",
                    "telephone" =>"required|min:1",
                    "adresse" =>"required",
                    "email" =>["nullable","email",Rule::unique(User::class)->ignore(Auth::id())],
                    "login" =>["nullable","min:1",Rule::unique(User::class)->ignore(Auth::id())],
                    //"password" =>"required",
                    "niveauValidation"=>strtolower($request->fonction["libelle"])=="COMPTABLE" ?"required":""
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
        }

        DB::beginTransaction();


        try{

            if (!$request->personnel)
            {
                $user=$personnel->update([
                    "nom" =>$request->nom,
                    "prenom" =>$request->prenom,
                    "telephone" =>$request->telephone,
                    "adresse" =>$request->adresse,
                    "login" =>$request->login,
                    "email" =>$request->email,
                    //"password" =>Hash::make($request->password),
                ]);
            }
            else
            {
                /*if(strtolower($request->fonction["libelle"])=="comptable" || strtolower($request->fonction["libelle"])=="directeur")
                {

                    $request->validate([
                        "email" =>["nullable","email",Rule::unique(User::class)->ignore(Auth::id())],
                        "login" =>["nullable","min:1",Rule::unique(User::class)->ignore(Auth::id())],
                        //"password" =>"required",
                    ]);

                    dd(12);
                }*/

                $user=User::find($request->personnel["id"]);

                $user->login=$request->login;
                $user->email=$request->email;
                //$user->password=$request->password;

                if ($request->fonction)
                {
                    if(strtolower($request->fonction["libelle"])=="COMPTABLE")
                    {
                        $user->niveauValidation=$request->niveauValidation;
                    }
                    $user->save();
                }
            }



            $user->etablissement()->associate(Auth::user()->etablissementAdmin->id)->save();

            $user->roles()->syncWithoutDetaching(Role::where("libelle","personnel")->first());

            $anneeScolaire=Auth::user()->etablissementAdmin->anneeEnCours;

            $contrat = $user->contratEnCours()->where("annee_scolaire_id",$anneeScolaire->id)->where('actif',true)->first();

            //dd($contrat,$user->contratEnCours,$anneeScolaire);

            if (!$contrat)
            {
                $contrat=Contrat::create([
                    "dateDebut"=> \Illuminate\Support\Carbon::now(),
                    "annee_scolaire_id" =>$anneeScolaire->id,
                    "user_id" =>$user->id,
                    "etablissement_id"=>Auth::user()->etablissementAdmin->id,
                ]);


                $user->contratEnCours()->associate($contrat)->save();
            }

            if ($request->fonction)
            {
                if(strtolower($request->fonction["libelle"])==="COMPTABLE")
                {
                    $user->update([
                        'niveauValidation'=>$request->niveauValidation
                    ]);
                }


                if(strtolower($request->fonction["libelle"])=="enseignant")
                {
                    //dd($request->coursList,$request->coursDeleted);
                    foreach($request->coursList as $cours)
                    {
                        isset($cours['nouveau']) ? $nouveau = $cours['nouveau'] : $nouveau=false;

                        if($nouveau)
                        {
                            $cours = Cours::create([
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
                                $contratFonctionMois->personnel()->associate(User::where("id",$user->id)->first())->save();

                            }
                        }


                    }

                    foreach($request->coursDeleted as $cours)
                    {
                        $cours=Cours::find($cours["id"]);

                        if($cours)
                        {
                            $cours->status=false;
                            $cours->save();

                            $cf=Contrat_fonction::where("cours_id",$cours["id"])->where("status",true)->first();
                            $cf->status=false;
                            $cf->save();

                            $cfm=Contrat_fonction_mois::where("contrat_fonction_id",$cours["id"])->where("status",true)->first();
                            $cfm->status=false;
                            $cfm->save();
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
                        $contratFonctionMois->personnel()->associate(User::where("id",$user->id)->first())->save();

                    }
                }
            }



            DB::commit();

            return redirect()->route('etablissement.personnel.contrat.index',[Auth::user()->id,$personnel->id])->with("success","Personnel modifié avec succès");

        }
        catch(Exception $e){

            echo($e);
            DB::rollback();
        }
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id,User $personnel)
    {
             if($personnel->status=="Actif")
             {
                 $personnel->status="Inactif";
                 $personnel->save();
                 return redirect()->back()->with("success","Employé bloqué avec succès");
             }
             else
             {
                 $personnel->status="Actif";
                 $personnel->save();
                 return redirect()->back()->with("success","Employé debloqué avec succès");
             }
    }

    public function salaire()
    {
        $codeNumeros=Code_numero::all();

        $anneeEnCours=Auth::user()->etablissementAdmin->anneeEnCours;

        $intervalle=CarbonPeriod::create($anneeEnCours->dateDebut,"1 month",$anneeEnCours->dateFin)->roundMonth();

        $mois=collect();

        foreach($intervalle as $date)
        {
            $mois->push(Mois::where("position",$date->month)->first());
        }

        $personnels=User::whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->whereRelation("roles","libelle","personnel")->with("salaires.mois","contratFonctionMois.mois")->where('status',"Actif")->orderByDesc("created_at")->get();

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

        $salaires=Salaire::whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->whereRelation("anneeScolaire","id",Auth::user()->etablissementAdmin->anneeEnCours->id)->where("status","ANNULE")->where("niveauValidation",1)->with("personnel","mois","anneeScolaire")->where("niveauValidation",1)->orderByDesc('id')->get();

        return Inertia::render('Etablissement/Personnel/Salaire',["personnels"=>$personnels,"mois"=>$mois,"anneeEnCours"=>$anneeEnCours,"salaires"=>$salaires,"codeNumeros"=>$codeNumeros]);
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
               Salaire::create([
                    "numero_depot"=>User::find($key)->telephone,
                    "montant"=>$value,
                    "mois_id"=>$mois,
                    "etablissement_id"=>Auth::user()->etablissementAdmin->id,
                    "annee_scolaire_id"=>Auth::user()->etablissementAdmin->anneeEnCours->id,
                    "personnel_id"=>$key
                ]);
            }

            DB::commit();

            return redirect()->back()->with("success","Paiements de salaires mis en attente de validation ");

        }
        catch(\Exception $e){

            dd($e);
            DB::rollback();
        }
    }

    public function validationSalaire()
    {
        $salaires=Salaire::whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->whereRelation("personnel","status","Actif")->where("niveauValidation",1)->where("annee_scolaire_id",Auth::user()->etablissementAdmin->anneeEnCours->id)->with("personnel","mois","anneeScolaire")->where("status","<>","ANNULE")->orderByDesc('id')->get();
        $paiementsOccasionnels=Paiement_occasionnel::whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->where("annee_scolaire_id",Auth::user()->etablissementAdmin->anneeEnCours->id)->where("niveauValidation",1)->with("anneeScolaire")->where("status","<>","ANNULE")->orderByDesc('id')->get();

        return Inertia::render('Etablissement/Personnel/Validation',["salaires"=>$salaires,"paiementsOccasionnels"=>$paiementsOccasionnels]);
    }

    public function validationStore(Request $request,$user)
    {

        DB::beginTransaction();

        try{
            foreach($request->all() as $salaire)
            {
                $s=Salaire::where("id",$salaire["id"])->first();

                Salaire::where("id",$s->id)->first()->cashin();
            }
            DB::commit();

            return Inertia::render("Etablissement/Personnel/ValidationOk");
        }
        catch(Exception $e){
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

            return redirect()->back()->with("success","Paiements annulé avec succès");
        }
        catch(\Exception $e){
            dd($e);
            DB::rollback();
        }

    }

    public function salaireOccasionnelStore(Request $request,$userId)
    {
        $request->validate([
            "nom" =>"required|min:1",
            "prenom" =>"required|min:1",
            "telephone" =>"required|min:1",
            "montant" =>"required|min:1",
            "motif" =>"required|min:1",
        ]);

        DB::beginTransaction();

        try{
                Paiement_occasionnel::create([
                    "nom"=>$request->nom,
                    "prenom"=>$request->prenom,
                    "motif"=>$request->motif,
                    "numero_depot"=>$request->telephone,
                    "montant"=>$request->montant,
                    "etablissement_id"=>Auth::user()->etablissementAdmin->id,
                    "annee_scolaire_id"=>Auth::user()->etablissementAdmin->anneeEnCours->id,
            ]);

            DB::commit();

            return redirect()->back()->with("success","Paiements mis en attentes de validation");
        }
        catch(\Exception $e){
            DB::rollback();
        }

    }

    public function validationOccasionnelStore(Request $request,$user)
    {

        DB::beginTransaction();

        try{
            foreach($request->all() as $paiementOccasionnel)
            {
                $p = Paiement_occasionnel::where("id",$paiementOccasionnel["id"])->first();

                Paiement_occasionnel::where("id",$p->id)->first()->cashin();

            }
            DB::commit();

            return Inertia::render("Etablissement/Personnel/ValidationOk");
        }
        catch(\Exception $e){
            echo($e);
            DB::rollback();
        }

    }

    public function validationOccasionnelCancel(Request $request,$user)
    {

        $paiementOccasionnel=Paiement_occasionnel::find($request->paiementOccasionnelId);

        dd(1);
        DB::beginTransaction();

        try{
            $paiementOccasionnel=Paiement_occasionnel::find($request->paiementOccasionnelId);
            $paiementOccasionnel->motifAnnulation=$request->motifAnnulation;
            $paiementOccasionnel->status="ANNULE";
            $paiementOccasionnel->niveauValidation=1;
            $paiementOccasionnel->save();
            DB::commit();

            return redirect()->back()->with("success","Paiements annulé avec succès");
        }
        catch(\Exception $e){
            dd($e);
            DB::rollback();
        }

    }

    public function historique($user,$ok=null)
    {
        //$salaires=Salaire::where('status',"VALIDE")->whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->with("personnel","mois","anneeScolaire")->orderByDesc('id')->get();

        //$paiementOccasionnel=Paiement_occasionnel::where('status',"VALIDE")->whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->with("anneeScolaire")->orderByDesc('id')->get();

        $salaires=Salaire::whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->where('status',"VALIDE")->with("personnel","mois","anneeScolaire")->orderByDesc('id')->get();

        $paiementOccasionnel=Paiement_occasionnel::whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->where('status',"VALIDE")->with("anneeScolaire")->orderByDesc('id')->get();

        return Inertia::render('Etablissement/Personnel/Historique',["salaires"=>$salaires,"paiementOccasionnel"=>$paiementOccasionnel,]);
    }

    public function listePaiementRapport($user,$ok=null)
    {
        //$salaires=Salaire::where('status',"VALIDE")->whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->with("personnel","mois","anneeScolaire")->orderByDesc('id')->get();

        //$paiementOccasionnel=Paiement_occasionnel::where('status',"VALIDE")->whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->with("anneeScolaire")->orderByDesc('id')->get();

        $salaires=Salaire::whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->with("personnel","mois","anneeScolaire")->orderByDesc('id')->get();

        $paiementOccasionnel=Paiement_occasionnel::whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->with("anneeScolaire")->orderByDesc('id')->get();

        return Inertia::render('Etablissement/Personnel/ListePaiementRapport',["salaires"=>$salaires,"paiementOccasionnel"=>$paiementOccasionnel,]);
    }

    public function filtre(Request $request)
    {
        $date_debut = Carbon::parse($request->get('dateDebut'))->startOfDay();
        $date_fin = Carbon::parse($request->get('dateFin'))->endOfDay();

        if($request->onglet=="salaire")
        {
            $salaires=Salaire::whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->whereBetween('created_at',[$date_debut,$date_fin])->with("personnel","mois","anneeScolaire")->orderByDesc('id')->get();
            return $salaires;
        }

        if($request->onglet=="occasionnel")
        {
            $paiementOccasionnel=Paiement_occasionnel::whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->whereBetween('created_at',[$date_debut,$date_fin])->with("anneeScolaire")->orderByDesc('id')->get();

            return $paiementOccasionnel;
        }

    }


}
