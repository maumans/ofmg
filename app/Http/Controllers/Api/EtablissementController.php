<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Etablissement as ResourcesEtablissement;
use App\Models\Apprenant;
use App\Models\Etablissement;
use App\Models\Type_paiement;
use Illuminate\Http\Request;

class EtablissementController extends Controller
{

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function validation($etablissementCode)
    {
        return Etablissement::where('code', $etablissementCode)->first()?true:false;
    }

    public function chargementOperations($etablissementCode)
    {
        return Type_paiement::whereRelation('tarifs.etablissement',"code", $etablissementCode)->get();
    }

    public function verification($code,$matricule)
    {
        //return Apprenant::where("matricule",$matricule)->first()->classe->etablissement;
        $apprenant = Apprenant::where("matricule",$matricule)->whereRelation("classe.etablissement","code",$code)->with("tarifs.typePaiement")->first();

        $operations=collect();

        if($apprenant)
        {
            foreach($apprenant->tarifs as $tarif)
            {
                $operations->push(["operationId"=>$tarif->typePaiement->id,"libelle"=>$tarif->typePaiement->libelle,"MontantGlobal"=>$tarif->montant,"resteApayer"=>$tarif->pivot->resteApayer]);
            }
        }
        else
        {
            $operations=null;
        }

        $ap=["nom"=>$apprenant->nom,"prenom"=>$apprenant->prenom,"matricule"=>$apprenant->matricule,"classe"=>$apprenant->classe->libelle];

        $etablissement=Etablissement::where("code",$code)->with("typeEtablissement")->first();

        $et=["code"=>$etablissement->code,"nom"=>$etablissement->nom,"type"=>$etablissement->typeEtablissement->libelle];

        $données=["status"=>$apprenant?"SUCCESS":"FAILED","data"=>["etablissement"=>$et,"apprenant"=>$ap,"operations"=>$operations]];

        return response()->json($données,$apprenant?201:400);
    }



}
