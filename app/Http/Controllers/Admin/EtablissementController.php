<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Commune;
use App\Models\Etablissement;
use App\Models\Role;
use App\Models\Type_etablissement;
use App\Models\User;
use App\Models\Ville;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rules;

class EtablissementController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $etablissements=Etablissement::where("id",">",0)->with("ville","commune","typeEtablissement","admins")->get();
        $communes=Commune::all();
        $villes=Ville::where("id",">",0)->with("communes")->get();
        $typeEtablissements=Type_etablissement::all();

        return Inertia::render('Admin/Etablissement/Index',["etablissements"=>$etablissements,"typeEtablissements"=>$typeEtablissements,"villes"=>$villes,"communes"=>$communes]);
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
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            "nomEtablissement"=>"required",
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', Rules\Password::defaults()],

        ]);



        $etablissement=Etablissement::create([
            "nom"=>$request->nomEtablissement
        ]);

        $user=User::create([
            "nom"=>"sainte",
            "prenom"=>"marie",
            "email"=>$request->email,
            'password' => Hash::make($request->password),

        ]);
        $user->roles()->syncWithoutDetaching(Role::where("libelle", "etablissement")->first());
        $user->etablissementAdmin()->associate($etablissement)->save();

        $request->commune!=null && $etablissement->commune()->associate(Commune::find($request->commune["id"]))->save();
        $etablissement->typeEtablissement()->associate(Type_etablissement::find($request->typeEtablissement["id"]))->save();
        $request->ville!=null && $etablissement->ville()->associate(Ville::find($request->ville["id"]))->save();




        return redirect()->back();

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
     * @param Etablissement $etablissement
     * @return \Illuminate\Http\RedirectResponse
     */

    public function destroy($id,Etablissement $etablissement)
    {
        $etablissement->delete();

        return redirect()->back();
    }
}
