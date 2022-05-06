<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class AnneeScolaireIsDefined
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if($request->user() && !$request->user()->etablissementAdmin->anneeScolaireIsDefined())
        {
            return Redirect::route("etablissement.index",["id"=>$request->user()->id])->with("error","Veuillez definir l'année scolaire");
        }
        return $next($request);
    }
}
