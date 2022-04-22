<?php

namespace App\Http\Controllers\Etablissement;

use App\Http\Controllers\Controller;
use App\Models\Apprenant;
use App\Models\Inscription;
use App\Models\Niveau;
use App\Models\Role;
use App\Models\Tarif;
use App\Models\User;
use App\Models\Ville;
use Carbon\Carbon;
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
        $niveaux=Auth::user()->etablissementAdmin->niveaux()->with("tarifs",function ($query){
            $query->whereRelation("typePaiement","concerne","APPRENANT")->with("typePaiement",)->get();
        })->get();

        $villes=Ville::all();
        $anneeEnCours=Auth::user()->etablissementAdmin->anneeScolaires->last();

        $anneeScolaires=Auth::user()->etablissementAdmin->anneeScolaires()->orderByDesc('created_at')->get();


        $tarifs=Auth::user()->etablissementAdmin->tarifs()->where("annee_scolaire_id",$anneeEnCours->id)->with("typePaiement")->get();

        $inscriptions=Inscription::whereRelation('niveau',"etablissement_id",Auth::user()->etablissementAdmin->id)->with(["apprenant"=>function($query){
            return $query->with("tarifs")->get();
        },"niveau"=>function($query){
            return $query->with(["tarifs"=>function($query){
                return $query->with("typePaiement")->get();
            }])->get();
        }])->get();


        $tuteurs =User::whereRelation("roles","libelle","tuteur")->get("telephone");

        return Inertia::render('Etablissement/Inscription/Index',["niveaux"=>$niveaux,"villes"=>$villes,"tarifs"=>$tarifs,"anneeEnCours"=>$anneeEnCours,"inscriptions"=>$inscriptions,"tuteurs"=>$tuteurs,"anneeScolaires"=>$anneeScolaires]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $niveaux=Auth::user()->etablissementAdmin->niveaux()->with(["tarifs"=>function ($query){
            $query->whereRelation("typePaiement","concerne","APPRENANT")->with("typePaiement",)->get();
        },"etablissement.typeEtablissement"])->get();

        $villes=Ville::all();
        $anneeEnCours=Auth::user()->etablissementAdmin->anneeScolaires->last();

        $tarifs=Auth::user()->etablissementAdmin->tarifs()->where("annee_scolaire_id",$anneeEnCours->id)->with("typePaiement")->get();

        $tuteurs =User::whereRelation("roles","libelle","tuteur")->get("telephone");

        return Inertia::render('Etablissement/Inscription/Create',["niveaux"=>$niveaux,"villes"=>$villes,"tarifs"=>$tarifs,"anneeEnCours"=>$anneeEnCours,"tuteurs"=>$tuteurs]);
    }

    public function search($userId,$search)
    {
        $tuteurs =User::where("telephone",'LIKE','%'.$search.'%')->orWhere->where("email",'LIKE','%'.$search.'%')->whereRelation("roles","libelle","tuteur")->get();

        return $tuteurs;
    }

    public function searchInscription(Request $request,$userId)
    {
        $niveauId=$request->niveauId;
        $anneeScolaireId=$request->anneeScolaireId;

        if($niveauId && $anneeScolaireId)

        {
            $inscriptions =Inscription::whereRelation("niveau",'id',$niveauId)->whereRelation("anneeScolaire",'id',$anneeScolaireId)->with(["apprenant"=>function($query){
                return $query->with("tarifs")->get();
            },"niveau"=>function($query){
                return $query->with(["tarifs"=>function($query){
                    return $query->with("typePaiement")->get();
                }])->get();
            },"anneeScolaire"])->get();

        }
        else{
            if($niveauId)
            {
                $inscriptions =Inscription::whereRelation("niveau",'id',$niveauId)->with(["apprenant"=>function($query){
                    return $query->with("tarifs")->get();
                },"niveau"=>function($query){
                    return $query->with(["tarifs"=>function($query){
                        return $query->with("typePaiement")->get();
                    }])->get();
                },"anneeScolaire"])->get();
            }
            else if($anneeScolaireId)
            {
                $inscriptions =Inscription::whereRelation("anneeScolaire",'id',$anneeScolaireId)->with(["apprenant"=>function($query){
                    return $query->with("tarifs")->get();
                },"niveau"=>function($query){
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
            "niveau" =>"required",
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
           ]);


           foreach($request->tuteursAdd as $tuteur)
           {
               if($tuteur["id"]==null)
               {
                   $tuteur=User::create($tuteur);
                   $tuteur->roles()->syncWithoutDetaching(Role::where("libelle","tuteur")->first());
               }
               $apprenant->tuteurs()->syncWithoutDetaching(User::find($tuteur["id"]));
           }

           //$anneeEnCours=Auth::user()->etablissementAdmin->anneeScolaires->last();


           $inscription->niveau()->associate(Niveau::find($request->niveau["id"]))->save();
           $inscription->apprenant()->associate($apprenant)->save();
           $inscription->anneeScolaire()->associate(Auth::user()->etablissementAdmin->anneeEnCours)->save();


           foreach($request->tarifs as $key=>$value){
               if($value)
               {
                   $anneeScolaire=Tarif::find($key)->anneeScolaire;

                   $nombreMois= Carbon::parse($anneeScolaire->dateFin)->diffInMonths(Carbon::parse($anneeScolaire->dateDebut));

                   $apprenant->tarifs()->syncWithoutDetaching([$key=>["resteApayer"=>Tarif::find($key)->montant,"nombreMois"=>$nombreMois,"annee_scolaire_id"=>$anneeScolaire->id]]);

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
            "niveau_id"=>$request->dataEdit["niveau"]["id"],
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
                    $inscription->apprenant->tarifs()->syncWithoutDetaching(Tarif::find($key));
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
