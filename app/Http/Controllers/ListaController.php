<?php

namespace App\Http\Controllers;

use App\Models\Lista;
use Illuminate\Http\Request;
use Inertia\Inertia;


class ListaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $listas = Lista::where('user_id', auth()->id())->with('tarefas')->get();
        return Inertia::render('Listas/Index', [
            'listas' => $listas,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descricao' => 'nullable|string',
        ]);

        Lista::create([
            ...$validated,
            'user_id' => auth()->id()
        ]);
        return redirect()->route('listas.index')->with('success', 'Lista criada com sucesso!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Lista $lista)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descricao' => 'nullable|string',
        ]);

        $lista->update($validated);
        return redirect()->route('listas.index')->with('success', 'Lista atualizada com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lista $lista)
    {
        $lista->delete();

        return redirect()->route('listas.index')->with('success', 'Lista deleteda com sucesso!');
    }
}
