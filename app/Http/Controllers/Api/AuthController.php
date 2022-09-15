<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Throwable;

class AuthController extends Controller
{


    /**
     * @OA\Post(
     * path="/api/register",
     * operationId="Register",
     * tags={"Inscription"},
     * summary="Enregistrer l'utilisateur",
     * description="Enregistrez l'utilisateur ici",
     *     @OA\RequestBody(
     *         @OA\JsonContent(),
     *         @OA\MediaType(
     *            mediaType="multipart/form-data",
     *            @OA\Schema(
     *               type="object",
     *               required={"prenom","nom","email", "password"},
     *               @OA\Property(property="prenom", type="text"),
     *               @OA\Property(property="nom", type="text"),
     *               @OA\Property(property="login", type="text"),
     *               @OA\Property(property="password", type="password"),
     *
     *            ),
     *        ),
     *    ),
     *      @OA\Response(
     *          response=201,
     *          description="Enregistré avec succès",
     *          @OA\JsonContent()
     *       ),
     *      @OA\Response(
     *          response=200,
     *          description="Enregistré avec succès",
     *          @OA\JsonContent()
     *       ),
     *      @OA\Response(
     *          response=422,
     *          description="Entité non traitable",
     *          @OA\JsonContent()
     *       ),
     *      @OA\Response(response=400, description="Mauvaise requete"),
     *      @OA\Response(response=404, description="Ressource introuvable"),
     * )
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required',
            'prenom' => 'required',
            'login' => 'required|unique:users',
            'password' => 'required',
        ]);

        DB::beginTransaction();

        try {
            $data = $request->all();
            $data['password'] = Hash::make($data['password']);
            $user = User::create($data);
            $success['token'] = $user->createToken('authToken')->accessToken;
            $user->currentToken = $success['token'];
            $user->save();
            $success['prenom'] = $user->prenom;
            $success['nom'] = $user->nom;

            DB::commit();

            return response()->json(['success' => $success]);
        }
        catch (Throwable $e)
        {
            DB::rollback();
            return null;
        }
    }


    /*
        /**
         * @OA\Post(
         * path="/api/login",
         * operationId="authLogin",
         * tags={"Connexion"},
         * summary="Connexion",
         * description="Connexion de l'utilsateur",
         *     @OA\RequestBody(
         *         @OA\JsonContent(),
         *         @OA\MediaType(
         *            mediaType="multipart/form-data",
         *            @OA\Schema(
         *               type="object",
         *               required={"email", "password"},
         *               @OA\Property(property="email", type="email"),
         *               @OA\Property(property="password", type="password")
         *            ),
         *        ),
         *    ),
         *      @OA\Response(
         *          response=201,
         *          description="Connecté avec success",
         *          @OA\JsonContent()
         *       ),
         *      @OA\Response(
         *          response=200,
         *          description="Connecté avec success",
         *          @OA\JsonContent()
         *       ),
         *      @OA\Response(
         *          response=422,
         *          description="Entité non traitable",
         *          @OA\JsonContent()
         *       ),
         *      @OA\Response(response=400, description="Mauvaise requete"),
         *      @OA\Response(response=404, description="Ressource introuvable"),
         * )
         */

    public function login(Request $request)
    {
        $validator = $request->validate([
            'login' => 'required',
            'password' => 'required'
        ]);

        if (!auth()->attempt($validator)) {
            return response()->json(['error' => 'Unauthorised'], 401);
        } else {
            $success['token'] = auth()->user()->createToken('authToken')->accessToken;
            $success['user'] = auth()->user();
            return response()->json(['success' => $success])->setStatusCode(200);
        }
    }
}
