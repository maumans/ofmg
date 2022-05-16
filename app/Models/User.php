<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable // implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'titre',
        'situation_matrimoniale',
        "date_naissance",
        "telephone",
        "commentaire"
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];


    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function paiementsTuteur()
    {
        return $this->hasMany(Paiement::class,"tuteur_id");
    }

    public function paiementsPersonnel()
    {
        return $this->hasMany(Paiement::class,"personnel_id");
    }

    public function paiementsEtablissement()
    {
        return $this->hasMany(Paiement::class,"etablissement_id");
    }

    public function commune()
    {
        return $this->belongsTo(Commune::class);
    }

    public function ville()
    {
        return $this->belongsTo(Ville::class);
    }

    public function tuteurEtablissement()
    {
        return $this->belongsTo(Etablissement::class,"tuteur_id");
    }

    public function adminEtablissementUsers()
    {
        return $this->hasMany(User::class,"admin_id");
    }

    public function etablissementAdmin()
    {
        return $this->belongsTo(Etablissement::class,"etablissement_id");
    }

    public function isAdmin()
    {
        if($this->roles()->where("libelle","admin")->first())
            return true;
        else return false;

    }

    public function isEtablissement()
    {
        if($this->roles()->where("libelle","etablissement")->first())
            return true;
        else return false;
    }

    public function isTuteur()
    {
        if($this->roles()->where("libelle","tuteur")->first())
            return true;
        else return false;
    }

    public function tuteurApprenants()
    {
        return $this->belongsToMany(Apprenant::class,"apprenant_tuteur","tuteur_id","apprenant_id");
    }

}
