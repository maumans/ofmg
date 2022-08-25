<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $users=User::whereRelation("roles","libelle","!=","personnel")->with("roles","etablissement")->get();
        $roles=Role::all();

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

        $user=User::create($request->validate([
            "nom" =>"required|min:1",
            "prenom" =>"required|min:1",
            "email" =>"required|min:1|email|unique:users",
            "telephone" =>"required",
            "situation_matrimoniale" =>"required",
            "password" =>"required",
        ]));

        foreach ($request->roles as $role)
        {
            $user->roles()->syncWithoutDetaching(Role::find($role["id"]));
        }

        return redirect()->back()->with("success", "Utilisateur créé avec succès");;
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
