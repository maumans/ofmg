<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
//use Laravel\Sanctum\HasApiTokens;
use Laravel\Passport\HasApiTokens ;

class User extends Authenticatable // implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */

    /*
    protected $fillable = [
        'nom',
        'prenom',
        'login',
        'email',
        'password',
        'titre',
        'situation_matrimoniale',
        "date_naissance",
        "telephone",
        "commentaire",
        "adresse"
    ];
    */

    protected $guarded=[];

    protected $appends = ['salairesAp','userName','horairePersonnel'];

    protected $salairesAp,$userName,$horairePersonnel;

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

    public function getSalairesApAttribute(){
        return $this->salairesAp;
    }
     public function getUserNameAttribute(){
        return $this->login;
    }


    public function setSalairesApAttribute($salairesAp){
        $this->salairesAp = $salairesAp;
    }

    public function getHorairePersonnelAttribute(){

        $cf=Contrat_fonction::where('user_id',$this->id)->where('status',true)->whereRelation('fonction','libelle','ENSEIGNANT')->first();

        return (bool)$cf;
    }

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


    public function etablissement()
    {
        return $this->belongsTo(Etablissement::class,"etablissement_id");
    }

    public function paiementGlobaux()
    {
        return $this->hasMany(PaiementGlobal::class,'tuteur_id');
    }

    public function isAdmin()
    {
        if($this->roles()->where("libelle","admin")->first())
            return true;
        else return false;

    }

    public function isOfmg()
    {
        if($this->roles()->where("libelle","ofmg")->first())
            return true;
        else return false;

    }

    public function isComptable()
    {
        if($this->contrats()->whereRelation("contratFonctions.fonction","libelle","COMPTABLE")->first())
            return true;
        else return false;

    }
    public function isDirecteur()
    {
        if($this->contrats()->whereRelation("contratFonctions.fonction","libelle","DIRECTEUR")->first())
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

    public function contrats()
    {
        return $this->hasMany(Contrat::class);
    }

    public function salaires()
    {
        return $this->hasMany(Salaire::class,"personnel_id");
    }

    public function contratFonctions()
    {
        return $this->hasMany(Contrat_fonction::class);
    }

    public function contratEnCours()
    {
        return $this->belongsTo(Contrat::class,"contrat_id");
    }

    public function contratFonctionMois()
    {
        return $this->hasMany(Contrat_fonction_mois::class);
    }

    public function cours()
    {
        return $this->hasMany(Cours::class,'personnel_id');
    }

}
