<?php

namespace Database\Seeders;

use App\Models\Type_paiement;
use Illuminate\Database\Seeder;

class TypePaiementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Type_paiement::create([
            "libelle" =>"FRAIS SCOLAIRES"
        ]);

        Type_paiement::create([
            "libelle" =>"SALAIRE PERSONNEL"
        ]);

        Type_paiement::create([
            "libelle" =>"INSCRIPTION"
        ]);

        Type_paiement::create([
            "libelle" =>"REINSCRIPTION"
        ]);

        Type_paiement::create([
            "libelle" =>"FRAIS DE CANTINE"
        ]);

        Type_paiement::create([
            "libelle" =>"APEAE"
        ]);
    }
}
