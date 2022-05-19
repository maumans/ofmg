<?php

namespace App\Http\Controllers\Etablissement;

use App\Http\Controllers\Controller;
use App\Models\Classe;
use App\Models\Departement;
use App\Models\Niveau;
use App\Models\Option;
use Carbon\Traits\Options;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ClasseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $options=null;
        $departements=null;
        $classes=Auth::user()->etablissementAdmin->classes()->with("option.departement","niveau")->get();

        Auth::user()->etablissementAdmin->typeEtablissement->libelle=="Université" && $niveaux=Niveau::whereRelation("cycle","libelle","Université")->with("cycle")->get();
        Auth::user()->etablissementAdmin->typeEtablissement->libelle=="Ecole" && $niveaux=Niveau::whereRelation("cycle","libelle","Lycée")->with("cycle")->get();

        $departement=null;
        Auth::user()->etablissementAdmin->typeEtablissement->libelle=="Université" && $departements=Departement::with("options")->get();
        Auth::user()->etablissementAdmin->typeEtablissement->libelle=="Ecole" && $options=Option::doesntHave("departement")->get();

        return Inertia::render('Etablissement/Classe/Index',["classes"=>$classes,"niveaux"=>$niveaux,"options"=>$options,"departements"=>$departements]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request["etablissement_id"]=Auth::user()->etablissementAdmin->id;

        $request->validate([
            "libelle"=>["required",Rule::unique("classes")->where(function($query) use ($request){
                $query->where("libelle",$request["libelle"])->where("etablissement_id",$request["etablissement_id"]);
            })],
            "niveau"=>"required",
        ],
        [
            "libelle.unique"=>"Cette classe existe déja"
        ]);

        $classe=Classe::create([
            "libelle"=>$request->libelle,
            "code"=>$request->code,
        ]);

        $classe->niveau()->associate(Niveau::find($request->niveau["id"]))->save();


        $request->option!=null && $classe->option()->associate(Option::find($request->option["id"]))->save();

        $classe->etablissement()->associate(Auth::user()->etablissementAdmin)->save();

        return redirect()->back()->with("success","Classe ajoutée avec succès");
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id,Classe $classe)
    {
        $classe=$classe->with('apprenants')->first();


        return Inertia::render("Etablissement/Classe/Show",["classe"=>$classe]);
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
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request,$id, Classe $classe)
    {
        $classe->update([
            "libelle"=>$request->dataEdit["libelle"],
            "description"=>$request->dataEdit["description"],
        ]);

        $classe->save();

        return redirect()->back()->with("success");
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id, Classe $classe)
    {
        $classe->delete();

        return redirect()->back();
    }
}
