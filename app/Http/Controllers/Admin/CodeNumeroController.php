<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Code_numero;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CodeNumeroController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $codeNumeros = Code_numero::all();

        return Inertia::render('Admin/CodeNumero/Index',["codeNumeros"=>$codeNumeros]);
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
            "libelle"=>"required|unique:code_numeros"
        ]);

        Code_numero::create($request->validate([
            "libelle"=>"required"
        ]));

        return redirect()->back()->with("success", "Code de numéro créé avec succès");;
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
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $codeNumero=Code_numero::find($request->editId);
        $codeNumero->libelle=$request->libelleEdit;
        $codeNumero->save();

        return redirect()->back()->with("success","Code de numéro modifié avec succès");
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id,Code_numero $codeNumero)
    {
        $codeNumero->delete();

        return redirect()->back();
    }
}
