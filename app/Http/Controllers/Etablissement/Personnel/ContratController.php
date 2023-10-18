<?php

namespace App\Http\Controllers\Etablissement\Personnel;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ContratController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($user,$personnelId)
    {
        $personnel=User::where("id",$personnelId)->where('status',"Actif")->with(["contrats"=>function($query){
            $query->with("contratFonctions.fonction","anneeScolaire","contratFonctions.anneeScolaire","user","contratFonctions.cours.matiere","contratFonctions.cours.classe")->orderByDesc("created_at")->get();
        }])->orderByDesc('created_at')->first();

        return Inertia::render("Etablissement/Personnel/Contrat/Index",["personnel"=>$personnel]);
    }
}
