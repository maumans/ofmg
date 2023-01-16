<?php

namespace App\Http\Controllers\Tuteur;

use App\Http\Controllers\Controller;
use App\Models\Apprenant;
use App\Models\Code_numero;
use App\Models\Mode_paiement;
use App\Models\Paiement;
use App\Models\PaiementGlobal;
use App\Models\Tarif;
use App\Models\Transaction;
use App\Models\Type_paiement;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use function Sodium\add;

class PaiementController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $codeNumeros=Code_numero::all();

        $totalAll=0;
        $resteApayerAll=0;
        $payerAll=0;

        $tuteur=User::where('id',Auth::user()->id)->with(["paiementsTuteur"=>function($query){
            $query->orderByDesc('created_at')->with("apprenant","typePaiement","modePaiement","tarif","etablissement",'paiementGlobal')->get();
        },"tuteurApprenants"=>function($query){
            $query->whereHas("classe.etablissement.anneeEnCours")->with(["classe.etablissement.anneeEnCours","tarifs.typePaiement","tarifs"=>function($query){
                $query->get();
            }])->get();
        }])->first();

        //dd(User::where('id',Auth::user()->id)->first()->paiementsTuteur()->with('paiementGlobal')->get()->last());

        $transactions=Transaction::whereRelation('paiementGlobal.tuteur',"id",$tuteur->id)->with('paiementGlobal.tuteur',"paiementGlobal.etablissement","paiementGlobal.paiements.apprenant","paiementGlobal.paiements.typePaiement")->orderByDesc('created_at')->get();

        foreach($tuteur->tuteurApprenants as $apprenant)
        {
            foreach($apprenant->tarifs as $tarif)
            {
                $totalAll=$totalAll+$tarif->montant;
                $resteApayerAll=$resteApayerAll+$tarif->pivot->resteApayer;
            }
        }

        $payerAll=$totalAll-$resteApayerAll;

        $donneesParFrais= new Collection();

        foreach(Type_paiement::all() as $typePaiement)
        {
            $montant=$tuteur->tuteurApprenants->sum(function($apprenant) use ($typePaiement){
                return $apprenant->tarifs()->where("type_paiement_id",$typePaiement->id)->first()?$apprenant->tarifs()->where("type_paiement_id",$typePaiement->id)->first()->montant:0;
            });

            $resteApayer=$tuteur->tuteurApprenants->sum(function($apprenant) use ($typePaiement){
                return $apprenant->tarifs()->where("type_paiement_id",$typePaiement->id)->first()?$apprenant->tarifs()->where("type_paiement_id",$typePaiement->id)->first()->pivot->resteApayer:0;
            });

            if($montant)
            {
                $donneesParFrais->push(["libelle"=>$typePaiement->libelle,"montant"=>$montant,"resteApayer"=>$resteApayer,"payer"=>$montant-$resteApayer]);
            }
        }

        return Inertia::render("Tuteur/Paiement/Index",["tuteur"=>$tuteur,"resteApayerAll"=>$resteApayerAll,"totalAll"=>$totalAll,"payerAll"=>$payerAll,"donneesParFrais"=>$donneesParFrais,"codeNumeros"=>$codeNumeros,"transactions"=>$transactions]);
    }

    public function search($userId,$matricule)
    {

        $codeNumeros=Code_numero::all();

        $apprenant=Apprenant::where("matricule",$matricule)->first();

        $etablissement=$apprenant ? $apprenant->classe->etablissement:null;

        $anneeEnCours=$etablissement ? $etablissement->anneeScolaires->last():null;

        $apprenant=$apprenant ? Apprenant::where("matricule",$matricule)->with(["tarifs"=>function($query){
            $query->with("typePaiement")->get();
        },"classe"=>function($query){
            $query->with(["tarifs"=>function($query){
                $query->with("typePaiement")->get();
            },'etablissement']);
        },
            "paiements"=>function($query) use ($anneeEnCours,$apprenant){
                $query->whereHas("tarif",function ($query) use ($anneeEnCours,$apprenant){
                    $query->where('annee_scolaire_id', $anneeEnCours->id);
                })->with("typePaiement","tarif")->get();

            }
        ])->first():$apprenant;

        $nbrMois=$anneeEnCours ? Carbon::parse($anneeEnCours->dateFin)->diffInMonths(Carbon::parse($anneeEnCours->dateDebut)):null;

        $apprenant && $apprenant->tarifs->map(function($tarif) use($apprenant){

            $tarif->resteApayer=$tarif->montant-$apprenant->paiements->where("type_paiement_id",$tarif->typePaiement->id)->sum("montant");
        });



        $paiements=$apprenant ? $apprenant->paiements()->with("tarif","typePaiement")->get()->unique('type_paiement_id'):null;

        $apprenant ?  $paiements->map(function($paiement) use ($apprenant)
        {
            $paiement->resteApayer=$paiement->tarif->montant-$apprenant->paiements->where("type_paiement_id",$paiement->tarif->typePaiement->id)->sum("montant");
        }):null;

        $tuteur=User::where('id',Auth::user()->id)->with(["paiementsTuteur"=>function($query){
            $query->orderByDesc('created_at')->with("apprenant","typePaiement","modePaiement","tarif")->get();
        }])->first();

        $modePaiements=Mode_paiement::where("libelle","!=","PAIEMENT WEB");

        return Inertia::render("Tuteur/Paiement/Create",["etablissement"=>$etablissement,"apprenant"=>$apprenant,"matricule"=>$matricule,"nbrMois"=>$nbrMois,"modePaiements"=>$modePaiements,"paiements"=>$paiements,"tuteur"=>$tuteur,"codeNumeros"=>$codeNumeros]);
    }

    public function filtre(Request  $request,$userId)
    {

        $date_debut = Carbon::parse($request->get('dateDebut'))->startOfDay();
        $date_fin = Carbon::parse($request->get('dateFin'))->endOfDay();

        if($request->onglet=="paiement")
        {
            $tuteur=User::where('id',Auth::user()->id)->with(["paiementsTuteur"=>function($query)use($date_debut,$date_fin){
                $query->whereBetween('created_at',[$date_debut,$date_fin])->orderByDesc('created_at')->with("apprenant","typePaiement","modePaiement","tarif","etablissement")->get();
            }])->first();

            $paiements=$tuteur->paiementsTuteur;

            return $paiements;
        }

        if($request->onglet=="transaction")
        {
            $transactions=Transaction::whereRelation('paiementGlobal.tuteur',"id",$userId)->whereBetween('created_at',[$date_debut,$date_fin])->orderByDesc('created_at')->get();

            return $transactions;
        }


    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $tuteur=User::where('id',Auth::user()->id)->with(["paiementsTuteur"=>function($query){
            $query->orderByDesc('created_at')->with("apprenant","typePaiement","modePaiement","tarif")->get();
        }])->first();

        return Inertia::render("Tuteur/Paiement/Create",["tuteur"=>$tuteur]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {

        DB::beginTransaction();

        try{
            $paiementGlobal=PaiementGlobal::create([
                "montant" =>$request->total,
                "numero_retrait" =>$request->numero_retrait,
                "etablissement_id"=>$request->etablissement["id"],
                "tuteur_id"=>Auth::user()->id
            ]);

            foreach ($request->tarifs as $key =>$value)
            {

                $info=explode("_",$key);
                $apprenant=Apprenant::find($info[0]);

                $tarif=Tarif::where("id",$info[1])->first();

                if($value)
                {

                    $paiement=Paiement::create([
                        "montant"=>$request->montants[$info[0]."_".$info[1]],
                        "numero_retrait"=>$request->numero_retrait,
                        "type_paiement_id"=>$tarif["type_paiement_id"],
                        "mode_paiement_id"=>Mode_paiement::where("libelle","PAIEMENT WEB")->first()->id,
                        "tuteur_id"=>Auth::user()->id,
                        "etablissement_id"=>$tarif->etablissement_id,
                        "paiement_global_id"=>$paiementGlobal->id
                    ]);

                    $paiement->tarif()->associate(Tarif::find($tarif["id"]))->save();
                    $paiement->apprenant()->associate(Apprenant::find($apprenant["id"]))->save();
                }
            }

            PaiementGlobal::where("id",$paiementGlobal->id)->first()->cashout();

            DB::commit();

            return redirect()->route('tuteur.paiement.ok',['total'=>$request->total,"paiementGlobalId"=>$paiementGlobal->id]);
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
    public function destroy($id)
    {
        //
    }

    public function ok($total,$paiementGlobalId)
    {

        $transaction=Transaction::where('item_key',$paiementGlobalId)->first();

        $tuteur=User::where('id',Auth::user()->id)->with(["paiementsTuteur"=>function($query){
            $query->orderByDesc('created_at')->with("apprenant","typePaiement","modePaiement","tarif")->get();
        },"tuteurApprenants"=>function($query){
            $query->with(["classe.etablissement.anneeEnCours","tarifs.typePaiement","tarifs"=>function($query){
                $query->get();
            }])->get();
        }])->first();

        return Inertia::render("Tuteur/Paiement/Ok",["tuteur"=>$tuteur,"total"=>$total,"transaction"=>$transaction]);
    }
}
