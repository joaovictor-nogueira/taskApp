<?php

namespace App\Http\Controllers;

use App\Models\Lista;
use App\Models\Tarefa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        $listas = Lista::where("user_id", $user->id)->get();
        $tarefas = Tarefa::whereHas('lista', function($query) use ($user) {
            $query->where('user_id', $user->id);
        })->get();
        $stats = [
            'totalListas' => $listas->count(),
            'totalTarefas' => $tarefas->count(),
            'completedTarefas' => $tarefas->where('is_completed', true)->count(),
            'pendingTarefas' => $tarefas->where('is_completed', false)->count(),
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'tarefas' => $tarefas,
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
        //
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
