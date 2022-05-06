<?php

namespace Database\Seeders;

use App\Models\Mois;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MoisSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        DB::table('mois')->delete();


        Mois::create([
            "libelle" =>"janvier",
            "position" =>1,
        ]);

        Mois::create([
            "libelle" =>"février",
            "position" =>2,
        ]);

        Mois::create([
            "libelle" =>"mars",
            "position" =>3,
        ]);

        Mois::create([
            "libelle" =>"avril",
            "position" =>4,
        ]);

        Mois::create([
            "libelle" =>"mai",
            "position" =>5,
        ]);

        Mois::create([
            "libelle" =>"juin",
            "position" =>6,
        ]);
        Mois::create([
            "libelle" =>"juillet",
            "position" =>7,
        ]);

        Mois::create([
            "libelle" =>"août",
            "position" =>8
        ]);

        Mois::create([
            "libelle" =>"septembre",
            "position" =>9,
        ]);

        Mois::create([
            "libelle" =>"octobre",
            "position" =>10,
        ]);

        Mois::create([
            "libelle" =>"novembre",
            "position" =>11,
        ]);

        Mois::create([
            "libelle" =>"décembre",
            "position" =>12,
        ]);
    }
}
