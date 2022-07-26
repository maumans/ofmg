<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Type_paiement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TypePaiementController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $typePaiements=Type_paiement::all();

        return Inertia::render('Admin/TypePaiement/Index',["typePaiements"=>$typePaiements]);
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
       Type_paiement::create($request->validate([
            "libelle"=>"required"
        ]));

        return redirect()->back()->with("success", "Type de frais créé avec succès");;
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
     * @param int $id
     * @param Type_paiement $typePaiement
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id,Type_paiement $typePaiement)
    {
        $typePaiement->delete();

        return redirect()->back();
    }
}
