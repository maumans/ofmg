<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Fonction;
use App\Models\Matiere;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MatiereController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $matieres=Matiere::all();

        return Inertia::render('Admin/Matiere/Index',["matieres"=>$matieres]);
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
        Matiere::create($request->validate([
            "libelle"=>"required|unique:matieres"
        ]));

        return back()->with("success","Matiere ajoutée avec succès");
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
        //dd($request->all());
        $matiere=Matiere::find($request->editId);
        $matiere->libelle=$request->libelleEdit;
        $matiere->save();

        return redirect()->back()->with("success","Matière modifiée avec succès");
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Matiere $matiere
     * @return \Illuminate\Http\Response
     */
    public function destroy($id,Matiere $matiere)
    {
        $matiere->delete();

        return redirect()->back()->with("error","Matière supprimée avec succès");
    }
}
