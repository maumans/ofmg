<?php

namespace App\Http\Controllers\Etablissement;

use App\Http\Controllers\Controller;
use App\Models\Inscription;
use App\Models\Niveau;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class NiveauController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $niveaux=Auth::user()->etablissementAdmin->niveaux;
        return Inertia::render('Etablissement/Niveau/Index',["niveaux"=>$niveaux]);
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
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            "libelle"=>["required",Rule::unique("niveaux")->where(function($query) use ($request) {
                return $query->where("etablissement_id",Auth::user()->etablissementAdmin->id)->where("libelle",$request->libelle);
            })],
            "description"=>"required"
        ]);

        $niveau=Niveau::create([
            "libelle"=>$request->libelle,
            "description"=>$request->description,
        ]);

        $niveau->etablissement()->associate(Auth::user()->etablissementAdmin)->save();

        return redirect()->back();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id,Niveau $niveau)
    {
        $niveau=$niveau->with('apprenants')->first();


        return Inertia::render("Etablissement/Niveau/Show",["niveau"=>$niveau]);
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
    public function update(Request $request,$id, Niveau $niveau)
    {
        $niveau->update([
            "libelle"=>$request->dataEdit["libelle"],
            "description"=>$request->dataEdit["description"],
        ]);

        $niveau->save();

        return redirect()->back()->with("success");
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id, Niveau $niveau)
    {
        $niveau->delete();

        return redirect()->back();
    }
}
