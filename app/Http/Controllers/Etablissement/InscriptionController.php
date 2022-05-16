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
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Validation\Rules;

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

        $inscriptions=Inscription::whereRelation('classe',"etablissement_id",Auth::user()->etablissementAdmin->id)->with(["apprenant"=>function($query){
            return $query->with("tarifs")->get();
        },"classe"=>function($query){
            return $query->with(["tarifs"=>function($query){
                return $query->with("typePaiement")->get();
            }])->get();
        }])->get();


        $tuteurs =User::whereRelation("roles","libelle","tuteur")->get("telephone");

        return Inertia::render('Etablissement/Inscription/Index',["classes"=>$classes,"villes"=>$villes,"tarifs"=>$tarifs,"anneeEnCours"=>$anneeEnCours,"inscriptions"=>$inscriptions,"tuteurs"=>$tuteurs,"anneeScolaires"=>$anneeScolaires]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $classes=Auth::user()->etablissementAdmin->classes()->with(["tarifs"=>function ($query){
            $query->whereRelation("typePaiement","concerne","APPRENANT")->with("typePaiement",)->get();
        },"etablissement.typeEtablissement"])->get();

        $villes=Ville::all();
        $anneeEnCours=Auth::user()->etablissementAdmin->anneeScolaires->last();

        $tarifs=Auth::user()->etablissementAdmin->tarifs()->where("annee_scolaire_id",$anneeEnCours->id)->with("typePaiement")->get();

        $tuteurs =User::whereRelation("roles","libelle","tuteur")->get("telephone");

        return Inertia::render('Etablissement/Inscription/Create',["classes"=>$classes,"villes"=>$villes,"tarifs"=>$tarifs,"anneeEnCours"=>$anneeEnCours,"tuteurs"=>$tuteurs]);
    }

    public function search($userId,$search)
    {
        $tuteurs =User::where("telephone",'LIKE','%'.$search.'%')->orWhere->where("email",'LIKE','%'.$search.'%')->whereRelation("roles","libelle","tuteur")->get();

        return $tuteurs;
    }

    public function searchInscription(Request $request,$userId)
    {
        $classeId=$request->classeId;
        $anneeScolaireId=$request->anneeScolaireId;
        $matricule=$request->matricule;

        if($matricule)
        {
            $inscriptions =Inscription::whereRelation("etablissement",'id',Auth::user()->etablissementAdmin->id)->whereRelation("apprenant",'matricule',$matricule)->with(["apprenant"=>function($query){
                return $query->with("tarifs","tuteurs")->get();
            },"classe"=>function($query){
                return $query->with(["tarifs"=>function($query){
                    return $query->with("typePaiement")->get();
                }])->get();
            },"anneeScolaire"])->get();
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
                },"anneeScolaire"])->get();

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
                    },"anneeScolaire"])->get();
                }
                else if($anneeScolaireId)
                {
                    $inscriptions =Inscription::whereRelation("anneeScolaire",'id',$anneeScolaireId)->with(["apprenant"=>function($query){
                        return $query->with("tarifs","tuteurs")->get();
                    },"classe"=>function($query){
                        return $query->with(["tarifs"=>function($query){
                            return $query->with("typePaiement")->get();
                        }])->get();
                    },"anneeScolaire"])->get();

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

        $request->validate([
            "nom" =>"required",
            "prenom" =>"required",
            "matricule" =>"required",
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


           foreach($request->tuteursAdd as $tuteur)
           {
               if($tuteur["id"]==null)
               {
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


           return redirect()->back()->with('success',"Apprenant inscrit avec succès");

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

        dd(1);
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
            "prenomTuteur"=>$request->dataEdit["prenomTuteur"],
            "nomTuteur"=>$request->dataEdit["nomTuteur"],
            "telephoneTuteur"=>$request->dataEdit["telephoneTuteur"],
            "emailTuteur"=>$request->dataEdit["emailTuteur"],
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
        $inscription->delete();

        return redirect()->back();
    }
}
