<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use http\Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Throwable;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $users=User::whereRelation("roles","libelle","!=","personnel")->orderByDesc("created_at")->with("roles","etablissement")->get();
        $roles=Role::where("libelle","<>","etablissement")->where("libelle","<>","tuteur")->where("libelle","<>","personnel")->get();

        return Inertia::render('Admin/User/Index',["users"=>$users,"roles"=>$roles]);

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
            "nom" =>"required|min:1",
            "prenom" =>"required|min:1",
            "login" =>"required|min:1|unique:users",
            "email" =>"min:5|email|unique:users",
            "telephone" =>"required|unique:users",
            //"situation_matrimoniale" =>"required",
            "password" =>"required",
        ]);

        DB::beginTransaction();

        try {
            $user=User::create([
                "nom" =>$request->nom,
                "prenom" =>$request->prenom,
                "login" =>$request->login,
                "email" =>$request->email,
                "telephone" =>$request->telephone,
                "situation_matrimoniale" =>$request->situation_matrimoniale,
                "password" =>Hash::make($request->password),
            ]);

            $user->roles()->syncWithoutDetaching(Role::find($request->role["id"]));

            DB::commit();

            return redirect()->back()->with("success", "Utilisateur créé avec succès");;
        }
        catch (\Exception $e)
        {
            dd($e->getMessage());
        }

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
    public function destroy($adminId,User $user)
    {
        $user->status=$user->status==="Actif"?"Inactif":"Actif";
        $user->save();

        return redirect()->back();
    }
}
