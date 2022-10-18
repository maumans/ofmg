<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Code_numero;
use App\Models\Commune;
use App\Models\Etablissement;
use App\Models\Contrat;
use App\Models\Role;
use App\Models\Type_etablissement;
use App\Models\User;
use App\Models\Ville;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
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
        $codeNumeros=Code_numero::all();

        $etablissements=Etablissement::where("id",">",0)->with(["ville","commune","typeEtablissement","admins"=>function($query){
            $query->orderByDesc("created_at")->get();
        }])->orderByDesc('created_at')->get();

        return Inertia::render('Admin/Etablissement/Index',["etablissements"=>$etablissements,"codeNumeros"=>$codeNumeros]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $codeNumeros=Code_numero::all();
        $communes=Commune::all();
        $villes=Ville::with("communes")->get();
        $typeEtablissements=Type_etablissement::all();

        return Inertia::render('Admin/Etablissement/Create',["typeEtablissements"=>$typeEtablissements,"villes"=>$villes,"communes"=>$communes,"codeNumeros"=>$codeNumeros]);
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
            "code"=>"required|string|unique:etablissements",
            'login' => 'required|string|unique:users',
            'telephone' => 'required|string|unique:etablissements',
            //'telephone' => 'required|string|unique:users',
            'email' => 'string|email|max:255|unique:users',
            'password' => ['required', Rules\Password::defaults()],
        ]);

        DB::beginTransaction();
        try {
            $user=User::create([
                "nom"=>$request->nom,
                "prenom"=>$request->prenom,
                "login"=>$request->login,
                "email"=>$request->email,
                'password' => Hash::make($request->password),
                "telephone"=>$request->telephoneAdmin,

            ]);

           $etablissement=Etablissement::create([
               "code"=>$request->code,
               "nom"=>$request->nomEtablissement,
               "user_id"=>$user->id,
               "telephone"=>$request->telephone,
            ]);

            $user->roles()->syncWithoutDetaching(Role::where("libelle", "etablissement")->first());

            $user->etablissementAdmin()->associate($etablissement)->save();

            Contrat::create([
                "dateDebut"=>Carbon::now(),
                "user_id" =>$user->id,
                "etablissement_id"=>$etablissement->id,
            ]);

            $request->commune!=null && $etablissement->commune()->associate(Commune::find($request->commune["id"]))->save();
            $request->typeEtablissement!=null && $etablissement->typeEtablissement()->associate(Type_etablissement::find($request->typeEtablissement["id"]))->save();
            $request->ville!=null && $etablissement->ville()->associate(Ville::find($request->ville["id"]))->save();

            DB::commit();

            $etablissements=Etablissement::with("ville","commune","typeEtablissement","admins")->orderByDesc('created_at')->get();

            return Inertia::render('Admin/Etablissement/Index',["etablissements"=>$etablissements])->with("success", "Etablissement créé avec succès");

        }
        catch(\Exception $e){

            echo($e);
            DB::rollback();
        }

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($user,$id)
    {
        $communes=Commune::all();
        $villes=Ville::with("communes")->get();

        $etablissement=Etablissement::where('id',$id)->with(['ville',"commune",'typeEtablissement',"anneeEnCours","paiements"=>function($query){
            $query->with('typePaiement',"modePaiement","apprenant.classe")->orderByDesc('created_at')->get();
        }])->first();

        return Inertia::render('Admin/Etablissement/Show',["etablissement"=>$etablissement]);

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($user,$id)
    {
        $communes=Commune::all();
        $typeEtablissements=Type_etablissement::all();
        $villes=Ville::with("communes")->get();
        $codeNumeros=Code_numero::all();

        $etablissement=Etablissement::where('id',$id)->with('ville',"commune",'typeEtablissement')->first();

        return Inertia::render('Admin/Etablissement/Edit',["etablissement"=>$etablissement,"communes"=>$communes,"villes"=>$villes,"typeEtablissements"=>$typeEtablissements,"codeNumeros"=>$codeNumeros]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id,$etablissementId)
    {
        /*
            $request->validate([
                "nomEtablissement"=>"required",
                "code"=>"required|string|unique:etablissements",
                'telephone' => 'required|string|unique:etablissements',
            ]);
        */

        DB::beginTransaction();
        try {
                $etablissement=Etablissement::find($etablissementId);

                $request->nomEtablissement && $etablissement->nom= $request->nomEtablissement;
                $request->code && $etablissement->code= $request->code;
                $request->telephone && $etablissement->telephone= $request->telephone;

                $etablissement->save();

                $request->commune!=null && $etablissement->commune()->associate(Commune::find($request->commune["id"]))->save();
                $request->typeEtablissement!=null && $etablissement->typeEtablissement()->associate(Type_etablissement::find($request->typeEtablissement["id"]))->save();
                $request->ville!=null && $etablissement->ville()->associate(Ville::find($request->ville["id"]))->save();

                DB::commit();

                return redirect()->back()->with("success", "Etablissement modifié avec succès");

        }
        catch(Exception $e){
            DB::rollback();
        }




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
