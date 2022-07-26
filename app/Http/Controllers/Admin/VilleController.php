<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Region;
use App\Models\Ville;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VilleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $villes=Ville::where("id",">",0)->with("region","communes")->get();
        $regions=Region::all();

        return Inertia::render('Admin/Ville/Index',["villes"=>$villes,"regions"=>$regions]);
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
            "libelle"=>"required|unique:villes",
            "region"=>"required"
        ]);

        $ville=Ville::create($request->validate([
            "libelle"=>"required"
        ]));

        $ville->region()->associate(Region::find($request->region["id"]))->save();

        return redirect()->back()->with("success", "Ville créée avec succès");;
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
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id,Ville $ville)
    {
        $ville->delete();

        return redirect()->back();
    }
}
