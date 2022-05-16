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
            "libelle" =>"Scolarité"
        ]);

        Type_paiement::create([
            "libelle" =>"Salaire du personnel"
        ]);

        Type_paiement::create([
            "libelle" =>"Inscription"
        ]);

        Type_paiement::create([
            "libelle" =>"Réinscription"
        ]);

        Type_paiement::create([
            "libelle" =>"Cantine"
        ]);

        Type_paiement::create([
            "libelle" =>"APEAE"
        ]);
    }
}
