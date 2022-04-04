<?php

namespace Database\Seeders;

use App\Models\Commune;
use App\Models\Region;
use App\Models\Ville;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdresseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        DB::table("communes")->delete();
        DB::table("villes")->delete();
        DB::table("regions")->delete();

        $region1=Region::create([
            "libelle" =>"Basse Guinee"
        ]);
        $region2=Region::create([
            "libelle" =>"Moyenne Guinee"
        ]);
        $region3=Region::create([
            "libelle" =>"Haute Guinee"
        ]);
        $region4=Region::create([
            "libelle" =>"Guinee Forestiére"
        ]);

        $ville1 = Ville::create(["libelle" =>"Conakry"]);
        $ville2 = Ville::create(["libelle" =>"Fria"]);
        $ville3 = Ville::create(["libelle" =>"Coyah"]);

        $commune1=Commune::create(["libelle" =>"Matoto"]);
        $commune2=Commune::create(["libelle" =>"Matam"]);
        $commune3=Commune::create(["libelle" =>"Dixinn"]);
        $commune4=Commune::create(["libelle" =>"Ratoma"]);
        $commune5=Commune::create(["libelle" =>"Kaloum"]);

        $ville1->communes()->saveMany([$commune1,$commune2,$commune3,$commune4,$commune5]);

        $region1->villes()->saveMany([$ville1,$ville2,$ville3]);

    }
}
