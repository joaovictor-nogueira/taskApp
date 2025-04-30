<?php

namespace App\Http\Controllers;

use App\Models\Lista;
use App\Models\Tarefa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TarefaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Tarefa::with('lista')->whereHas('lista', function ($query) {
            $query->where('user_id', auth()->id());
        })->orderBy('created_at', 'desc');

        if (request()->has('search')) {
            $search = request('search');
            $query->where(function ($q) use ($search) {
                $q->where('titulo', 'like', "%{$search}%")
                    ->orWhere('descricao', 'like', "%{$search}%");
            });
        }

        if (request()->has("filter") && request('filter') !== 'all') {
            $query->where('is_completed', request('filter') === 'completed');
        }

        $tarefas = $query->paginate(10);

        $listas = Lista::where('user_id', auth()->id())->get();

        return Inertia::render('Tarefas/Index', [
            'tarefas' => $tarefas,
            'listas' => $listas,
            'filters' => [
                'search' => request('search', ''),
                'filter' => request('filter', ''),
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'due_date' => 'nullable|date',
            'lista_id' => 'required|exists:listas,id',
            'is_completed' => 'boolean'
        ]);

        Tarefa::create([
            'titulo' => $validated['titulo'],
            'descricao' => $validated['descricao'],
            'due_date' => $validated['due_date'],
            'lista_id' => $validated['lista_id'],
            'is_completed' => $validated['is_completed'],
        ]);
        return redirect()->route('tarefas.index')->with('success', 'Tarefa criada com sucesso!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id) {}

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
    public function update(Request $request, Tarefa $tarefa)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'due_date' => 'nullable|date',
            'lista_id' => 'required|exists:listas,id',
            'is_completed' => 'boolean'
        ]);

        $tarefa->update([
            'titulo' => $validated['titulo'],
            'descricao' => $validated['descricao'],
            'due_date' => $validated['due_date'],
            'lista_id' => $validated['lista_id'],
            'is_completed' => $validated['is_completed'],
        ]);

        return redirect()->route('tarefas.index')->with('success', 'Tarefa atualizada com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tarefa $tarefa)
    {
        $tarefa->delete();

        return redirect()->route('tarefas.index')->with('success', 'Tarefa deleteda com sucesso!');
    }
}
