<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cycle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CycleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $cycles=Cycle::all();

        return Inertia::render('Admin/Cycle/Index',["cycles"=>$cycles]);
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
            "libelle"=>"required|unique:cycles"
        ]);

        Cycle::create($request->validate([
            "libelle"=>"required"
        ]));

        return redirect()->back()->with("success", "Cycle créé avec succès");
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($userId,$id)
    {
        $cycle=Cycle::where("id",$id)->with("niveaux")->first();

        return Inertia::render("Admin/Cycle/Show",["cycle"=>$cycle]);
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
        $cycle=Cycle::find($request->editId);
        $cycle->libelle=$request->libelleEdit;
        $cycle->save();

        return redirect()->back()->with("success","Cycle modifié avec succès");
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id,Cycle $cycle)
    {
        $cycle->delete();

        return redirect()->back();
    }
}
