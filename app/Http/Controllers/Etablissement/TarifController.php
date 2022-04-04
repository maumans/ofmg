<?php

namespace App\Http\Controllers\Etablissement;

use App\Http\Controllers\Controller;
use App\Models\Niveau;
use App\Models\Tarif;
use App\Models\Type_paiement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TarifController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $etablissement=Auth::user()->etablissementAdmin;

        $tarifs=$etablissement->tarifs()->with("niveau","typePaiement")->get();


        $typePaiements=Type_paiement::all();

        $niveaux=$etablissement->niveaux;

        $anneeScolaire=$etablissement->anneeScolaires->last();

        return Inertia::render("Etablissement/Tarif/Index",["tarifs"=>$tarifs,"typePaiements"=>$typePaiements,"niveaux"=>$niveaux,"anneeScolaire"=>$anneeScolaire,"etablissementId"=>$etablissement->id]);
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
            "montant" =>"required",
            "etablissement_id"=>["required",Rule::unique("tarifs","")->where(function($query) use ($request) {
                return $query->where("niveau_id",$request->niveau && $request->niveau["id"])->where("type_paiement_id",$request->typePaiement["id"]);
            })],
            [
                "etablissement_id.unique"=>"mau"
            ]
        ]);

        $tarif=Tarif::create([
            "montant"=>$request->montant,
            "frequence"=>$request->typePaiement["libelle"]=="INSCRIPTION"?"ANNUELLE":$request->frequence,
            "echeance"=>$request->typePaiement["libelle"]=="INSCRIPTION"?null:$request->echeance,
        ]);



        $tarif->etablissement()->associate(Auth::user()->etablissementAdmin)->save();
        $tarif->anneeScolaire()->associate(Auth::user()->etablissementAdmin->anneeScolaires->last())->save();
        $tarif->typePaiement()->associate(Type_paiement::find($request->typePaiement["id"]))->save();
        $request->niveau && $tarif->niveau()->associate(Niveau::find($request->niveau["id"]))->save();

       return redirect()->back()->with("success","tarif crée avec succès");
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
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, Tarif $tarif)
    {
        $tarif->delete();

        return redirect()->back();
    }
}
