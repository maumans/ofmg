<?php

namespace App\Http\Controllers\Etablissement\Personnel;

use App\Http\Controllers\Controller;
use App\Models\Contrat_fonction_mois;
use App\Models\Mois;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class horaireController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $personnels=User::has("contrats.contratFonctions")->whereRelation("contratEnCours.contratFonctions.fonction","libelle","Enseignant")->whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->with(["contrats"=>function($query){
            $query->with("contratFonctions.fonction","anneeScolaire","user")->orderByDesc("created_at")->get();
        }])->where('status',"Actif")->orderByDesc("created_at")->get();

        return Inertia::render('Etablissement/Personnel/Horaire/Index',["personnels"=>$personnels]);
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
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        foreach($request->all() as $key=>$nombreHeures)
        {
            if($key!="mois")
            {
                $cfm=Contrat_fonction_mois::find($key);

                $cfm->update([
                    "nombreHeures"=>$nombreHeures,
                    "salaire"=>$nombreHeures*$cfm->contratFonction->montant
                ]);
            }
        }
        return redirect()->back()->with("success","Horaires enregistrées avec succès");
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
            $query->with(["fonction","anneeScolaire","cours.matiere","cours.classe","contratFonctionMois.mois"])->orderByDesc("created_at")->get();
        }])->first();

        $mois=Mois::whereRelation("contratFonctionMois.contratFonction.user","id",$personnel->id)->whereRelation("contratFonctionMois.contratFonction.anneeScolaire","id",Auth::user()->etablissementAdmin->anneeEnCours->id)->get();

        return Inertia::render("Etablissement/Personnel/Horaire/Show",["personnel"=>$personnel,"mois"=>$mois]);
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
