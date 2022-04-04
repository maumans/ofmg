<?php

namespace App\Http\Middleware;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request)
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request)
    {
        $user=$request->user()?User::where('id',$request->user()->id)->first():null;

        return array_merge(parent::share($request), [
            'auth' => [
                'user' =>$user,
                'admin'=>$request->user() && $request->user()->isAdmin(),
                'etablissement'=>$request->user() && $request->user()->isEtablissement(),
                'tuteur'=>$request->user() && $request->user()->isTuteur(),
            ],
            "success"=>session("success"),
            "montantTotal"=>session("montantTotal"),
        ]);
    }
}
