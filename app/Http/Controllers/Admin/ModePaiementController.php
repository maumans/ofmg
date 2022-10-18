<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mode_paiement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ModePaiementController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $modePaiements=Mode_paiement::all();

        return Inertia::render('Admin/ModePaiement/Index',["modePaiements"=>$modePaiements]);
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
        Mode_paiement::create($request->validate([
            "libelle"=>"required|unique:mode_paiements"
        ]));

        return redirect()->back()->with("success","Mode de paiement ajouté avec succès");
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
        $modePaiement=Mode_paiement::find($request->editId);
        $modePaiement->libelle=$request->libelleEdit;
        $modePaiement->save();

        return redirect()->back()->with("success","Mode de paiement modifié avec succès");
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id,Mode_paiement $modePaiement)
    {
        $modePaiement->delete();

        return redirect()->back()->with("error","Mode de paiement supprimé avec succès");
    }
}
