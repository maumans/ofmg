<?php

namespace App\Rules;

use App\Models\Apprenant;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class matriculeUniqueParEtablissement implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        //Apprenant::where("matricule",$value)->whereRelation("classe.etablissement",Auth::user()->etablissementAdmin->id)->first();
        //dd(1);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Le :matricule doit etre unique par etablissement';
    }
}
