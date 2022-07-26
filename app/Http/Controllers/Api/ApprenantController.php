<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Apprenant;
use Illuminate\Http\Request;

class ApprenantController extends Controller
{

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function validationMatricule($matricule)
    {
        return Apprenant::where('matricule', $matricule)->first()?true:false;
    }

    public function chargementInfos($matricule)
    {
        return Apprenant::where('matricule', $matricule)->with('classe.etablissement')->first();
    }

}
