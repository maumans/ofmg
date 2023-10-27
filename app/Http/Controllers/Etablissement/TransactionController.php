<?php

namespace App\Http\Controllers\Etablissement;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TransactionController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        //$transactions=Transaction::with('paiementGlobal.tuteur',"paiementGlobal.etablissement","paiementGlobal.paiements.apprenant","paiementGlobal.paiements.typePaiement")->orderByDesc('created_at')->get();

        $transactions=[];
        return Inertia::render("Etablissement/Transaction/Index",["transactions"=>$transactions]);

    }


    public function filtre(Request  $request,$userId)
    {

        $date_debut = Carbon::parse($request->get('dateDebut'))->startOfDay();
        $date_fin = Carbon::parse($request->get('dateFin'))->endOfDay();

        $transactions=Transaction::where(function ($query){
            $query->
            whereRelation('paiementGlobal.etablissement',"id",Auth::user()->etablissementAdmin->id)->
            orWhereRelation('salaire.etablissement',"id",Auth::user()->etablissementAdmin->id)->
            orWhereRelation('paiementOccasionnel.etablissement',"id",Auth::user()->etablissementAdmin->id);
        })->whereBetween('created_at',[$date_debut,$date_fin])->orderByDesc('created_at')->get();

        return $transactions;
    }
}
