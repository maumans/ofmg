<?php

namespace App\Http\Controllers\Etablissement;

use App\Http\Controllers\Controller;
use App\Models\Annee_scolaire;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AnneeScolaireController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $anneeScolaires=Auth::user()->etablissementAdmin->anneeScolaires()->orderByDesc('created_at')->get();

        $anneeEnCoursFinie=Auth::user()->etablissementAdmin->anneeEnCours ==null;

        $anneeEnCours=Auth::user()->etablissementAdmin->anneeEnCours;

        $aujourdhui=Carbon::now()->format('Y-m-d');

        return Inertia::render('Etablissement/AnneeScolaire/Index',["anneeScolaires"=>$anneeScolaires,"anneeEnCoursFinie"=>$anneeEnCoursFinie,"aujourdhui"=>$aujourdhui,"anneeEnCours"=>$anneeEnCours]);
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
        $anneeScolaire=Annee_scolaire::create($request->validate([
            "dateDebut"=>"required|date",
            "dateFin"=>"required|date|after_or_equal:dateDebut'",
        ]));

        $anneeScolaire->etablissement()->associate(Auth::user()->etablissementAdmin)->save();

        $anneeScolaire->etablissement->anneeEnCours()->associate($anneeScolaire)->save();

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
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @param Annee_scolaire $anneeScolaire
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request,$id, Annee_scolaire $anneeScolaire)
    {
        $request->validate([
            "dataEdit.dateDebutEdit"=>"required|date",
            "dataEdit.dateFinEdit"=>"required|date|after:dataEdit.dateDebutEdit",
        ],
        [
            "dataEdit.dateDebutEdit.required"=>"La date de debut est requise",
            "dataEdit.dateDebutFin.required"=>"La date de fin est requise",
            "dataEdit.dateDebutEdit.date"=>"La date de debut doit etre une date",
            "dataEdit.dateDebutFin.date"=>"La date de fin doit etre une date",
            "dataEdit.dateFinEdit.after"=>"La date de fin doit etre superieure à la date de debut",

        ]);

        $anneeScolaire->update([
            "dateDebut"=>$request->dataEdit["dateDebutEdit"],
            "dateFin"=>$request->dataEdit["dateFinEdit"],
        ]);

        $anneeScolaire->save();

        return redirect()->back()->with("success");
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($userId,Annee_scolaire $anneeScolaire)
    {
        $anneeScolaire->delete();

        return redirect()->back()->with("Année scolaire supprimée avec succès");
    }

    public function cloture()
    {
       $anneeEnCours=Annee_scolaire::find(Auth::user()->etablissementAdmin->anneeEnCours->id);
       $anneeEnCours->actif=false;
       $anneeEnCours->save();
        Auth::user()->etablissementAdmin->anneeEnCours()->dissociate()->save();
        return redirect()->back()->with("succcess","Année cloturée avec succès à l'année prochaine");
    }
}
