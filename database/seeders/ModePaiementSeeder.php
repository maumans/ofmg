<?php

namespace Database\Seeders;

use App\Models\Mode_paiement;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ModePaiementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('etablissements')->delete();

        Mode_paiement::create(["libelle"=>"PAIEMENT WEB"]);
        Mode_paiement::create(["libelle"=>"PAIEMENT CASH"]);
        Mode_paiement::create(["libelle"=>"PAIEMENT USSD ET APPLI"]);
    }
}
