<?php

namespace App\Http\Controllers\Etablissement;

use App\Http\Controllers\Controller;
use App\Models\Inscription;
use App\Models\Niveau;
use App\Models\Cycle;
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
        $niveaux=Niveau::with("cycle","classes")->orderByDesc('created_at')->get();
        $cycles=Cycle::all();

        return Inertia::render('Etablissement/Niveau/Index',["niveaux"=>$niveaux,"cycles"=>$cycles]);
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
        $request->validate([
            "libelle"=>"required|unique:niveaux",
            "cycle"=>"required"
        ]);

        $niveau=Niveau::create($request->validate([
            "libelle"=>"required"
        ]));

        $niveau->cycle()->associate(Cycle::find($request->cycle["id"]))->save();

        return redirect()->back()->with("success", "Niveau créé avec succès");
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
        $niveau=Niveau::find($request->editId);
        $niveau->libelle=$request->libelleEdit;
        $niveau->save();

        return redirect()->back()->with("success","Niveau modifié avec succès");
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id,Niveau $niveau)
    {
        $niveau->delete();

        return redirect()->back();
    }
}
