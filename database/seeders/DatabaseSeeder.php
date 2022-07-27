<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();


        $this->call(RoleSeeder::class);
        $this->call(ModePaiementSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(TypeEtablissementSeeder::class);
        $this->call(AdresseSeeder::class);
        $this->call(EtablissementSeeder::class);
        $this->call(TypePaiementSeeder::class);
        $this->call(MoisSeeder::class);
    }
}
