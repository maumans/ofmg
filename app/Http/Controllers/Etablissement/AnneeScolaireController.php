<?php

namespace App\Http\Controllers\Etablissement;

use App\Http\Controllers\Controller;
use App\Models\Annee_scolaire;
use App\Models\Apprenant;
use App\Models\Apprenant_tarif;
use App\Models\Tarif;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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

        DB::beginTransaction();

        try{

            $anneeScolaire->etablissement()->associate(Auth::user()->etablissementAdmin)->save();

            $anneeScolaire->etablissement->anneeEnCours()->associate($anneeScolaire)->save();

            DB::commit();

            return redirect()->back();

        }
        catch(Throwable $e){
            DB::rollback();
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


        DB::beginTransaction();

        try{

            if($anneeScolaire->inscriptions)
            {
                return redirect()->back()->with("error","Vous ne pouvez plus modifier l'année scolaire car au moins un apprenant à été inscrit");
            }
            else
            {
                $anneeScolaire->update([
                    "dateDebut"=>$request->dataEdit["dateDebutEdit"],
                    "dateFin"=>$request->dataEdit["dateFinEdit"],
                ]);

                $anneeScolaire->save();
            }

            DB::commit();

            return redirect()->back()->with("success")->with("success","Année scolaire modifiée avec succès");
        }
        catch(Throwable $e){
            DB::rollback();
        }


    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($userId,Annee_scolaire $anneeScolaire)
    {

        $anneeScolaire->status=false;

        $anneeScolaire->save();

        $tarifs=Tarif::where('annee_scolaire_id',$anneeScolaire->id)->where('status',true)->get();

        if($tarifs)
        {
            foreach ($tarifs as $tarif)
            {
                $tarif->status=false;
                $tarif->save();
            }
        }

        return redirect()->back()->with("Année scolaire supprimée avec succès");
    }

    public function cloture()
    {
        DB::beginTransaction();

        try{

            $anneeEnCours=Annee_scolaire::find(Auth::user()->etablissementAdmin->anneeEnCours->id);
            $anneeEnCours->actif=false;
            $anneeEnCours->save();

            $tarifs=Tarif::where('annee_scolaire_id',$anneeEnCours->id)->where('status',true)->get();

            if($tarifs)
            {
                foreach ($tarifs as $tarif)
                {
                    /*$tarif->apprenants()->sync(
                        ['status' =>false]
                    );*/

                    $aps=Apprenant_tarif::where('tarif_id',$tarif->id)->get();

                    foreach ($aps as $ap)
                    {
                      $ap->status=false;
                      $ap->save();
                    }

                    $tarif->status=false;
                    $tarif->save();
                }
            }


            Auth::user()->etablissementAdmin->anneeEnCours()->dissociate()->save();

            DB::commit();

            return redirect()->back()->with("succcess","Année cloturée avec succès à l'année prochaine");

        }
        catch(Throwable $e){
            DB::rollback();
        }

    }
}
