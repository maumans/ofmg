<?php

namespace Database\Seeders;

use App\Models\Commune;
use App\Models\Etablissement;
use App\Models\Role;
use App\Models\Type_etablissement;
use App\Models\User;
use App\Models\Ville;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EtablissementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('etablissements')->delete();
        $etablissement=Etablissement::create([
            "nom"=>"Sainte Marie"
        ]);

        $user=User::create([
            "nom"=>"sainte",
            "prenom"=>"marie",
            "login"=>"sainteMarie",
            "email"=>"sm@gmail.com",
            'password' => Hash::make("29101997"),

        ]);
        $user->roles()->syncWithoutDetaching(Role::where("libelle", "etablissement")->first());
        $user->etablissementAdmin()->associate($etablissement)->save();

        $etablissement->commune()->associate(Commune::where("libelle", "dixinn")->first())->save();
        $etablissement->typeEtablissement()->associate(Type_etablissement::where("libelle", "ÉCOLE")->first())->save();
       $etablissement->ville()->associate(Ville::where("libelle", "conakry")->first())->save();
    }
}
