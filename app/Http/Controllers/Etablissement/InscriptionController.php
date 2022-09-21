<?php

namespace App\Http\Controllers\Etablissement;

use App\Http\Controllers\Controller;
use App\Models\Apprenant;
use App\Models\Apprenant_tarif;
use App\Models\Inscription;
use App\Models\Mois;
use App\Models\Mois_Paye;
use App\Models\Classe;
use App\Models\Role;
use App\Models\Tarif;
use App\Models\User;
use App\Models\Ville;
use App\Rules\matriculeUniqueParEtablissement;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Validation\Rules;
use Rap2hpoutre\FastExcel\Facades\FastExcel;

class InscriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        /*
            $classes=Auth::user()->etablissementAdmin->classes()->with("tarifs",function ($query){
                $query->whereRelation("typePaiement","concerne","APPRENANT")->with("typePaiement",)->get();
            })->get();
        */

        $classes=Auth::user()->etablissementAdmin->classes()->with("tarifs",function ($query){
            $query->whereRelation("typePaiement","concerne","APPRENANT")->with("typePaiement",)->get();
        })->get();

        $villes=Ville::all();
        $anneeEnCours=Auth::user()->etablissementAdmin->anneeScolaires->last();

        $anneeScolaires=Auth::user()->etablissementAdmin->anneeScolaires()->orderByDesc('created_at')->get();

        $tarifs=Auth::user()->etablissementAdmin->tarifs()->where("annee_scolaire_id",$anneeEnCours->id)->with("typePaiement")->get();

        $inscriptions=Inscription::whereRelation('classe.etablissement',"etablissement_id",Auth::user()->etablissementAdmin->id)->with(["apprenant"=>function($query){
            return $query->with("tarifs")->get();
        },"classe"=>function($query){
            return $query->with(["tarifs"=>function($query){
                return $query->with("typePaiement")->get();
            }])->get();
        },"anneeScolaire"])->orderByDesc('created_at')->get();

        $tuteurs =User::whereRelation("roles","libelle","tuteur")->get("telephone");

        return Inertia::render('Etablissement/Inscription/Index',["classes"=>$classes,"villes"=>$villes,"tarifs"=>$tarifs,"anneeEnCours"=>$anneeEnCours,"inscriptions"=>$inscriptions,"tuteurs"=>$tuteurs,"anneeScolaires"=>$anneeScolaires]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $classes=Auth::user()->etablissementAdmin->classes()->with(["tarifs"=>function ($query){
            $query->whereRelation("typePaiement","concerne","APPRENANT")->with("typePaiement",)->get();
        },"etablissement.typeEtablissement"])->get();

        $villes=Ville::all();

        $anneeEnCours=Auth::user()->etablissementAdmin->anneeEnCours()->with("etablissement.typeEtablissement")->first();

        $tarifs=Auth::user()->etablissementAdmin->tarifs()->where("annee_scolaire_id",$anneeEnCours->id)->with("typePaiement")->get();

        $tuteurs =User::whereRelation("roles","libelle","tuteur")->get("telephone");

        return Inertia::render('Etablissement/Inscription/Create',["classes"=>$classes,"villes"=>$villes,"tarifs"=>$tarifs,"anneeEnCours"=>$anneeEnCours,"tuteurs"=>$tuteurs]);
    }

    public function search($userId,$search)
    {
        $tuteurs =User::whereRelation("roles","libelle","tuteur")->where(function($query) use($search) {
            $query->where("telephone",'LIKE','%'.$search.'%')->orWhere("login",'LIKE','%'.$search.'%')->orWhere("email",'LIKE','%'.$search.'%')->get();
        })->get();

        return $tuteurs;
    }

    public function searchInscription(Request $request,$userId)
    {
        $classeId=$request->classeId;
        $anneeScolaireId=$request->anneeScolaireId;
        $matricule=$request->matricule;

        if($matricule)
        {
            $inscriptions =Inscription::whereRelation("classe.etablissement",'id',Auth::user()->etablissementAdmin->id)->whereRelation("apprenant",'matricule',$matricule)->with(["apprenant"=>function($query){
                return $query->with("tarifs","tuteurs")->get();
            },"classe"=>function($query){
                return $query->with(["tarifs"=>function($query){
                    return $query->with("typePaiement")->get();
                }])->get();
            },"anneeScolaire"])->orderByDesc('created_at')->get();

            if($classeId && $anneeScolaireId)
            {
                $inscriptions =$inscriptions->whereRelation("classe",'id',$classeId)->whereRelation("anneeScolaire",'id',$anneeScolaireId)->with(["apprenant"=>function($query){
                    return $query->with("tarifs","tuteurs")->get();
                },"classe"=>function($query){
                    return $query->with(["tarifs"=>function($query){
                        return $query->with("typePaiement")->get();
                    }])->get();
                },"anneeScolaire"])->get();

            }
            else {
                if ($classeId) {
                    $inscriptions = $inscriptions->whereRelation("classe", 'id', $classeId)->with(["apprenant" => function ($query) {
                        return $query->with("tarifs", "tuteurs")->get();
                    }, "classe" => function ($query) {
                        return $query->with(["tarifs" => function ($query) {
                            return $query->with("typePaiement")->get();
                        }])->get();
                    }, "anneeScolaire"])->get();
                } else if ($anneeScolaireId) {
                    $inscriptions = $inscriptions->whereRelation("anneeScolaire", 'id', $anneeScolaireId)->with(["apprenant" => function ($query) {
                        return $query->with("tarifs", "tuteurs")->get();
                    }, "classe" => function ($query) {
                        return $query->with(["tarifs" => function ($query) {
                            return $query->with("typePaiement")->get();
                        }])->get();
                    }, "anneeScolaire"])->orderByDesc('created_at')->get();
                }
            }
        }
        else
        {
            if($classeId && $anneeScolaireId)
            {
                $inscriptions =Inscription::whereRelation("classe",'id',$classeId)->whereRelation("anneeScolaire",'id',$anneeScolaireId)->with(["apprenant"=>function($query){
                    return $query->with("tarifs","tuteurs")->get();
                },"classe"=>function($query){
                    return $query->with(["tarifs"=>function($query){
                        return $query->with("typePaiement")->get();
                    }])->get();
                },"anneeScolaire"])->orderByDesc('created_at')->get();

            }
            else{
                if($classeId)
                {
                    $inscriptions =Inscription::whereRelation("classe",'id',$classeId)->with(["apprenant"=>function($query){
                        return $query->with("tarifs","tuteurs")->get();
                    },"classe"=>function($query){
                        return $query->with(["tarifs"=>function($query){
                            return $query->with("typePaiement")->get();
                        }])->get();
                    },"anneeScolaire"])->orderByDesc('created_at')->get();
                }
                else if($anneeScolaireId)
                {
                    $inscriptions =Inscription::whereRelation("anneeScolaire",'id',$anneeScolaireId)->with(["apprenant"=>function($query){
                        return $query->with("tarifs","tuteurs")->get();
                    },"classe"=>function($query){
                        return $query->with(["tarifs"=>function($query){
                            return $query->with("typePaiement")->get();
                        }])->get();
                    },"anneeScolaire"])->orderByDesc('created_at')->get();

                }
                else
                {
                    $inscriptions=null;
                }
            }
        }






        return $inscriptions;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {

        $apprenant=Apprenant::where('matricule', $request->matricule)->first();

        $validator=$request->validate([
            "nom" =>"required",
            "prenom" =>"required",
            "matricule" =>["required",
                function ($attribute, $value, $fail) {
                    if (Apprenant::where('matricule', $value)->whereRelation("classe.etablissement","id",Auth::user()->etablissementAdmin->id)->first()) {
                        $fail('Le '.$attribute.' est unique par etablissement');
                    }
                },
            ],
            "lieuNaissance" =>"required",
            "dateNaissance" =>"required",
            "classe" =>"required",
            "tuteursAdd" =>"required"

        ],
        [
            "tuteursAdd.required"=>"L'apprenant doit avoir au moins un tuteur"
        ]);

        DB::beginTransaction();

       try{

           $inscription=Inscription::create([
               "montant" =>$request->montant,
               "typePaiement.libelle"=>["required",Rule::unique("tarifs")->where(function($query) use ($request) {
                   return $query->where("etablissement_id",Auth::user()->etablissementAdmin->id)->where("typePaiement_id",$request->typePaiement["id"])->where("classe_id",$request->classe["id"]);
               })],
           ]);

           $apprenant=Apprenant::create([
               "nom" =>$request->nom,
               "prenom" =>$request->prenom,
               "matricule" =>$request->matricule,
               "classe_id" =>$request->classe["id"],
               "date_naissance" =>$request->dateNaissance,
               "lieu_naissance" =>$request->lieuNaissance,
           ]);

           foreach($request->tuteursAdd as $key =>$tuteur)
           {
               if($tuteur["id"]==null)
               {
                   $request->validate([
                       "tuteursAdd.*.email"=>"required|unique:users",
                       "tuteursAdd.*.telephone"=>"required|unique:users"
                   ],
                       [
                           "tuteursAdd.*.email.unique"=>"La valeur du champ email est déjà utilisée",
                           "tuteursAdd.*.telephone.unique"=>"La valeur du champ telephone est déjà utilisée"
                       ]);
                   $tuteur["password"]=Hash::make($tuteur["password"]);
                   $tuteur=User::create($tuteur);
                   $tuteur->roles()->syncWithoutDetaching(Role::where("libelle","tuteur")->first());
               }
               $apprenant->tuteurs()->syncWithoutDetaching(User::find($tuteur["id"]));
           }

           $inscription->classe()->associate(Classe::find($request->classe["id"]))->save();
           $inscription->apprenant()->associate($apprenant)->save();
           $inscription->anneeScolaire()->associate(Auth::user()->etablissementAdmin->anneeEnCours)->save();


           foreach($request->tarifs as $key=>$value){
               if($value)
               {
                   $tarif=Tarif::find($key);

                   $intervalle=CarbonPeriod::create($tarif->anneeScolaire->dateDebut,"1 month",$tarif->anneeScolaire->dateFin);


                   $anneeScolaire=$tarif->anneeScolaire;

                   $apprenant->tarifs()->syncWithoutDetaching([$key=>["resteApayer"=>$tarif->montant,"nombreMois"=>$intervalle->count(),"annee_scolaire_id"=>$anneeScolaire->id]]);

                   foreach($intervalle as $date)
                   {
                       $moisPaye=Mois_Paye::create([
                           "montant"=>0
                       ]);

                       $moisPaye->mois()->associate(Mois::where("position",$date->month)->first())->save();
                       $moisPaye->apprenantTarif()->associate(Apprenant_tarif::where("tarif_id",$tarif->id)->where("apprenant_id",$apprenant->id)->first())->save();

                   }
               }
           }


           DB::commit();

           return redirect()->route("etablissement.inscription.index",Auth::user()->id)->with('success',"Apprenant inscrit avec succès");

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
        //dd(1);
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
    public function update(Request $request,$id,Inscription $inscription)
    {

        $inscription->update([
            "classe_id"=>$request->dataEdit["classe"]["id"],
            "montant"=>$request->dataEdit["montant"],
        ]);

        $inscription->apprenant()->update([
            "prenom"=>$request->dataEdit["prenom"],
            "nom"=>$request->dataEdit["nom"],
            "matricule"=>$request->dataEdit["matricule"],
            "date_naissance"=>$request->dataEdit["dateNaissance"],
            "lieu_naissance"=>$request->dataEdit["lieuNaissance"],
        ]);
        $inscription->save();

        if($request->dataEdit["tarifs"])
        {
            $inscription->apprenant->tarifs()->detach();
            foreach($request->dataEdit["tarifs"] as $key=>$value){
                if($value)
                {
                    $tarif=Tarif::find($key);
                    $inscription->apprenant->tarifs()->syncWithoutDetaching([$tarif->id=>["resteApayer"=>$tarif->montant]]);


                    //////////////////

                    $intervalle=CarbonPeriod::create($tarif->anneeScolaire->dateDebut,"1 month",$tarif->anneeScolaire->dateFin);


                    $anneeScolaire=$tarif->anneeScolaire;

                    $inscription->apprenant->tarifs()->syncWithoutDetaching([$key=>["resteApayer"=>$tarif->montant,"nombreMois"=>$intervalle->count(),"annee_scolaire_id"=>$anneeScolaire->id]]);


                    foreach($intervalle as $date)
                    {
                        $moisPaye=Mois_Paye::create([
                            "montant"=>0
                        ]);

                        $moisPaye->mois()->associate(Mois::where("position",$date->month)->first())->save();
                        $moisPaye->apprenantTarif()->associate(Apprenant_tarif::where("tarif_id",$tarif->id)->where("apprenant_id",$inscription->apprenant->id)->first())->save();

                    }
                }
            }

        }

        return redirect()->back()->with("success","Inscription modifiée avec success");
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id, Inscription $inscription)
    {
        DB::beginTransaction();
        try {
            $inscription->apprenant->delete();
            $inscription->delete();

            DB::commit();

            return redirect()->back()->with("success","Inscription supprimée avec succès");

         }
        catch(Exception $e){

            echo($e);
            DB::rollback();
        }

    }



    public function import(Request $request)
    {
        DB::beginTransaction();

        try{
            $apprenantsExiste=collect();

            $nom=$request->file("inscriptions")->store("importInscription","public");
            $path=public_path()."\\storage\\".str_replace("/","\\",$nom);

            if (!empty($path) && is_file($path)) {
                FastExcel::import($path, function ($data) use ($apprenantsExiste) {
                    if ($data){
                        $apprenantEncours=Apprenant::whereRelation("classe.etablissement","id",Auth::user()->etablissementAdmin->id)->where("matricule",$data["matricule"])->first();
                        if(!$apprenantEncours)
                        {
                            $classe=Classe::where("libelle",$data["classe"])->whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->with(["tarifs.typePaiement"=>function($query){
                                $query->where("libelle","Inscription")->orWhere("libelle","Scolarité")->get();
                            }])->first();

                            dd($classe);


                            $apprenant = Apprenant::create([
                                "nom" => $data["nom"],
                                "prenom" => $data["prenom"],
                                "matricule" => $data["matricule"],
                                "lieu_naissance" => $data["lieuNaissance"],
                                "date_naissance" => $data["dateNaissance"],
                                "classe_id"=>$classe->id
                            ]);

                            $tarifInscription=$classe->tarifs->where("typePaiement.libelle","Inscription")->first();

                            $inscription=Inscription::create([
                                "montant" =>$tarifInscription->montant,
                                "typePaiement.libelle"=>["required",Rule::unique("tarifs")->where(function($query) use($tarifInscription,$classe) {
                                    return $query->where("etablissement_id",Auth::user()->etablissementAdmin->id)->where("typePaiement_id",$tarifInscription->typePaiement->id)->where("classe_id",$classe->id);
                                })],
                            ]);

                            $inscription->classe()->associate($classe)->save();
                            $inscription->apprenant()->associate($apprenant)->save();
                            $inscription->anneeScolaire()->associate(Auth::user()->etablissementAdmin->anneeEnCours)->save();

                            foreach($classe->tarifs as $tarif){
                                if($tarif)
                                {
                                    $intervalle=CarbonPeriod::create($tarif->anneeScolaire->dateDebut,"1 month",$tarif->anneeScolaire->dateFin);

                                    $anneeScolaire=$tarif->anneeScolaire;

                                    $apprenant->tarifs()->syncWithoutDetaching([$tarif->id=>["resteApayer"=>$tarif->montant,"nombreMois"=>$intervalle->count(),"annee_scolaire_id"=>$anneeScolaire->id]]);

                                    foreach($intervalle as $date)
                                    {
                                        $moisPaye=Mois_Paye::create([
                                            "montant"=>0
                                        ]);

                                        $moisPaye->mois()->associate(Mois::where("position",$date->month)->first())->save();
                                        $moisPaye->apprenantTarif()->associate(Apprenant_tarif::where("tarif_id",$tarif->id)->where("apprenant_id",$apprenant->id)->first())->save();

                                    }
                                }

                            }


                            if($data["nomTuteur"])
                            {
                                $tuteur=User::where("email",$data["emailTuteur"])->orWhere("telephone",$data["telephone"])->first();

                                if(!$tuteur)
                                {
                                    $tuteur=User::create([
                                        "nom"=>$data["nomTuteur"],
                                        "prenom"=>$data["prenomTuteur"],
                                        "telephone"=>$data["telephoneTuteur"],
                                        "login"=>$data["telephoneTuteur"],
                                        "email"=>$data["emailTuteur"],
                                        "password"=>Hash::make($data["telephoneTuteur"]),
                                    ]);

                                    $tuteur->roles()->syncWithoutDetaching(Role::where("libelle","tuteur")->first());
                                }
                            }

                            $apprenant->tuteurs()->syncWithoutDetaching(User::find($tuteur["id"]));
                        }
                        else
                        {
                            $apprenantsExiste->push($apprenantEncours);
                        }
                    }

                });
            }

            DB::commit();

            return $apprenantsExiste ? redirect()->back()->with("error","Import(s) en attente(s)"):redirect()->back()->with("success","Import effectué avec success");

        }
            catch(Throwable $e){
            echo($e);
            DB::rollback();
        }


    }
}
