<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Personaje;


class PersonajeController extends Controller
{

    public function index()
    {
        return Personaje::all();
    }

    public function store(Request $request)
    {
        $personaje = Personaje::create($request->all());
        return response()->json($personaje, 201);
    }

    public function show(Personaje $personaje)
    {
        return $personaje;
    }

    public function update(Request $request, Personaje $personaje)
    {
        $personaje->update($request->all());
        return $personaje;
    }

    public function destroy(Personaje $personaje)
    {
        $personaje->delete();
        return response()->json(['mensaje' => 'Eliminado']);
    }


}
