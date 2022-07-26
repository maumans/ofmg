<?php

namespace App\Http\Controllers\Etablissement;

use App\Http\Controllers\Controller;
use App\Models\Etablissement;
use App\Models\Fonction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class FonctionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $fonctions=Fonction::whereRelation("etablissement","id",Auth::user()->etablissementAdmin->id)->get();

        return Inertia::render('Etablissement/Fonction/Index',["fonctions"=>$fonctions]);
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
        $request['etablissement_id']=Auth::user()->etablissementAdmin->id;

        Fonction::create($request->validate([
            "libelle"=>["required",Rule::unique("fonctions")->where(function($query) use ($request){
                return $query->where("libelle",$request->libelle)->where("etablissement_id",$request->etablissement_id);
            })],
            "etablissement_id"=>"required"
        ]));

        return redirect()->back()->with("success","Fonction ajoutée avec succès");
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
    public function destroy($id,Fonction $fonction)
    {
        $fonction->delete();

        return redirect()->back()->with("error","Fonction supprimée avec succès");
    }
}
