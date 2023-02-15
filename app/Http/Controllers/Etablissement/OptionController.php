<?php

namespace App\Http\Controllers\Etablissement;

use App\Http\Controllers\Controller;
use App\Models\Cycle;
use App\Models\Departement;
use Illuminate\Http\Request;
use App\Models\Option;
use Inertia\Inertia;



class OptionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $options=Option::with("cycle","departement")->orderByDesc('created_at')->get();

        $cycles=Cycle::all();

        $departements=Departement::all();

        return Inertia::render('Etablissement/Option/Index',["options"=>$options,"cycles"=>$cycles,"departements"=>$departements]);
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
            "libelle"=>"required|unique:options",
            "cycle"=>"required"
        ]);

        $option=Option::create($request->validate([
            "libelle"=>"required"
        ]));

        $option->cycle()->associate(Cycle::find($request->cycle["id"]))->save();
        $request->departement!=null && $option->departement()->associate(Departement::find($request->departement["id"]))->save();

        return redirect()->back()->with("success", "Option créée avec succès");;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($userId,$id)
    {
        $option =Option::where("id",$id)->first();

        dd($option);


        return Inertia::render("Etalissement/Option/Show",["cycle"=>$option]);
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
        $option=Option::find($request->editId);
        $option->libelle=$request->libelleEdit;
        $option->save();

        return redirect()->back()->with("success","Option modifiée avec succès");
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id,Option $option)
    {
        $option->delete();

        return redirect()->back();
    }
}
