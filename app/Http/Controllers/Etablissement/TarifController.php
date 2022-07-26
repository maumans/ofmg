<?php

namespace App\Http\Controllers\Etablissement;

use App\Http\Controllers\Controller;
use App\Models\Classe;
use App\Models\Tarif;
use App\Models\Type_paiement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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

        $tarifs=$etablissement->tarifs()->with("classe","typePaiement")->orderByDesc('created_at')->get();


        $typePaiements=Type_paiement::with(["tarifs"=>function($query){
            $query->where('etablissement_id',Auth::user()->etablissementAdmin->id)->get();
        }])->get();

        //dd($typePaiements);

        $classes=$etablissement->classes;

        $anneeScolaire=$etablissement->anneeEnCours;

        return Inertia::render("Etablissement/Tarif/Index",["tarifs"=>$tarifs,"typePaiements"=>$typePaiements,"classes"=>$classes,"anneeScolaire"=>$anneeScolaire,"etablissementId"=>$etablissement->id]);
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
        ]);

        DB::beginTransaction();

        try{

            foreach($request->classes as $classe)
            {

                /*
                    $request->validate([
                        "classes.*" =>Rule::unique("tarifs")->where(function($query) use ($request,$classe){
                           return $query->where("type_paiement_id",$request->typePaiement["id"])->where("classe_id",$classe["id"]);
                        }),
                    ],
                    [
                        "classes.*.unique"=>["tarifs existant"]
                    ]);
                 */


                $tarif=Tarif::create([
                    "montant"=>$request->montant,
                    "obligatoire"=>$request->obligatoire,
                    "frequence"=>$request->typePaiement["libelle"]=="INSCRIPTION"?"ANNUELLE":$request->frequence,
                    "echeance"=>$request->typePaiement["libelle"]=="INSCRIPTION"?null:$request->echeance,
                ]);

                $tarif->etablissement()->associate(Auth::user()->etablissementAdmin)->save();
                $tarif->anneeScolaire()->associate(Auth::user()->etablissementAdmin->anneeEnCours)->save();
                $tarif->typePaiement()->associate(Type_paiement::find($request->typePaiement["id"]))->save();
                $classe && $tarif->classe()->associate(Classe::find($classe["id"]))->save();
            }

            DB::commit();

            return redirect()->back()->with("success","Service(s) crée(s) avec succès");
        }
        catch(Exception $e){

            echo($e);
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
        try {
            $tarif->delete();

            return redirect()->back();
        }
        catch (\Exception $e) {
            return redirect()->back()->with("error","Ce tarif est déja liéé a un referentiel");
        }
    }
}
