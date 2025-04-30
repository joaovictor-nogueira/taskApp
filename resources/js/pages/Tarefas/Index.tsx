import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Calendar, CheckCircle, CheckCircle2, ChevronLeft, ChevronRight, List, Pencil, Plus, Search, Trash2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Tarefa {
    id: number;
    titulo: string;
    descricao: string | null;
    is_completed: boolean;
    due_date: string | null;
    lista_id: number;
    lista: {
        id: number;
        titulo: string;
    };
}

interface Lista {
    id: number;
    titulo: string;
}

interface Props {
    tarefas: {
        data: Tarefa[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    listas: Lista[];
    filters: {
        search: string;
        filter: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tarefas',
        href: '/tarefas',
    },
];

export default function TarefasIndex({ tarefas, listas, filters, flash }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingTarefas, setEditingTarefas] = useState<Tarefa | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [completionFilter, setCompletionFilter] = useState<'all' | 'completed' | 'pending'>(filters.filter as 'all' | 'completed' | 'pending');

    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setToastType('success');
            setShowToast(true);
        } else if (flash?.error) {
            setToastMessage(flash.error);
            setToastType('error');
            setShowToast(true);
        }
    }, [flash]);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const {
        data,
        setData,
        post,
        put,
        processing,
        reset,
        delete: destroy,
    } = useForm({
        titulo: '',
        descricao: '',
        due_date: '',
        lista_id: '',
        is_completed: false as boolean,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingTarefas) {
            put(route('tarefas.update', editingTarefas.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    setEditingTarefas(null);
                },
            });
        } else {
            post(route('tarefas.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (tarefa: Tarefa) => {
        setEditingTarefas(tarefa);
        setData({
            titulo: tarefa.titulo,
            descricao: tarefa.descricao || '',
            due_date: tarefa.due_date || '',
            lista_id: tarefa.lista_id.toString(),
            is_completed: tarefa.is_completed,
        });
        setIsOpen(true);
    };

    const handleDelete = (tarefaId: number) => {
        destroy(route('tarefas.destroy', tarefaId));
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get(
            route('tarefas.index'),
            {
                search: searchTerm,
                filter: completionFilter,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleFilterChange = (value: 'all' | 'completed' | 'pending') => {
        setCompletionFilter(value);
        router.get(
            route('tarefas.index'),
            {
                search: searchTerm,
                filter: value,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            route('tarefas.index'),
            {
                page,
                search: searchTerm,
                filter: completionFilter,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tarefas" />
            <div className="from-background to-muted/20 flex h-full flex-1 flex-col gap-6 rounded-xl bg-gradient-to-br p-6">
                {showToast && (
                    <div
                        className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg ${
                            toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
                        } animate-in fade-in slide-in-from-top-5 text-white`}
                    >
                        {toastType === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                        <span>{toastMessage}</span>{' '}
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>{' '}
                        <p className="text-muted-foreground mt-1">Gerencie suas tarefas e mantenha-se organizado</p>{' '}
                    </div>{' '}
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger>
                            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg">
                                <Plus className="mr-2 h-4 w-4" />
                                Nova Tarefa
                            </Button>{' '}
                        </DialogTrigger>{' '}
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="text-xl">{editingTarefas ? 'Editar Tarefa' : 'Criar nova Tarefa'}</DialogTitle>{' '}
                            </DialogHeader>{' '}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="titulo">Titulo</Label>{' '}
                                    <Input
                                        id="titulo"
                                        value={data.titulo}
                                        onChange={(e) => setData('titulo', e.target.value)}
                                        required
                                        className="focus:ring-primary focus:ring-2"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="descricao">Descrição</Label>{' '}
                                    <Textarea
                                        id="descricao"
                                        value={data.descricao}
                                        onChange={(e) => setData('descricao', e.target.value)}
                                        className="focus:ring-primary focus:ring-2"
                                    />
                                </div>{' '}
                                <div className="space-y-2">
                                    <Label htmlFor="lista_id">Lista</Label>{' '}
                                    <Select value={data.lista_id} onValueChange={(value) => setData('lista_id', value)}>
                                        <SelectTrigger className="focus:ring-primary focus:ring-2">
                                            <SelectValue placeholder="Selecione a lista" />
                                        </SelectTrigger>{' '}
                                        <SelectContent>
                                            {listas.map((lista) => (
                                                <SelectItem key={lista.id} value={lista.id.toString()}>
                                                    {lista.titulo}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>{' '}
                                    </Select>{' '}
                                </div>{' '}
                                <div className="space-y-2">
                                    <Label htmlFor="due_date">Data de Vencimento</Label>{' '}
                                    <Input
                                        id="due_date"
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                        className="focus:ring-primary focus:ring-2"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="is_completed"
                                        checked={data.is_completed}
                                        onChange={(e) => setData('is_completed', e.target.checked)}
                                        className="focus:ring-primary h-4 w-4 rounded border-gray-300 focus:ring-2"
                                    />
                                    <Label htmlFor="is_completed">Completada</Label>{' '}
                                </div>{' '}
                                <Button type="submit" disabled={processing} className="bg-primary hover:bg-primary/90 w-full text-white shadow-lg">
                                    {editingTarefas ? 'Update' : 'Create'}
                                </Button>
                            </form>
                        </DialogContent>{' '}
                    </Dialog>{' '}
                </div>
                <div className="mb-4 flex gap-4">
                    <form onSubmit={handleSearch} className="relative flex-1">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                        <Input placeholder="Procurando tarefas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                    </form>{' '}
                    <Select value={completionFilter} onValueChange={handleFilterChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filtro por status" />
                        </SelectTrigger>{' '}
                        <SelectContent>
                            <SelectItem value="all">Todas Tarefas</SelectItem> <SelectItem value="completed">Completas</SelectItem>{' '}
                            <SelectItem value="pending">Pendentes</SelectItem>{' '}
                        </SelectContent>{' '}
                    </Select>{' '}
                </div>
                <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                                    <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Titulo</th>
                                    <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Descricao</th>
                                    <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Lista</th>
                                    <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Due Date</th>{' '}
                                    <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Status</th>{' '}
                                    <th className="text-muted-foreground h-12 px-4 text-right align-middle font-medium">Ações</th>{' '}
                                </tr>{' '}
                            </thead>{' '}
                            <tbody className="[&_tr:last-child]:border-0">
                                {tarefas.data.map((tarefa) => (
                                    <tr key={tarefa.id} className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                                        <td className="p-4 align-middle font-medium">{tarefa.titulo}</td>
                                        <td className="max-w-[200px] truncate p-4 align-middle">{tarefa.descricao || 'Sem descrição'}</td>
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-2">
                                                <List className="text-muted-foreground h-4 w-4" />
                                                {tarefa.lista.titulo}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            {tarefa.due_date ? (
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="text-muted-foreground h-4 w-4" />
                                                    {new Date(tarefa.due_date).toLocaleDateString()}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">Sem data de vencimento.</span>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {tarefa.is_completed ? (
                                                <div className="flex items-center gap-2 text-green-500">
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span>Completada</span>{' '}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-yellow-500">
                                                    <span>Pendente</span>{' '}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-right align-middle">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(tarefa)}
                                                    className="hover:bg-primary/10 hover:text-primary"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>{' '}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(tarefa.id)}
                                                    className="hover:bg-destructive/10 hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>{' '}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {tarefas.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-muted-foreground p-4 text-center">
                                            Sem tarefas encontradas{' '}
                                        </td>
                                    </tr>
                                )}
                            </tbody>{' '}
                        </table>{' '}
                    </div>{' '}
                </div>
                {/* Pagination */}
                <div className="flex items-center justify-between px-2">
                    <div className="text-muted-foreground text-sm">
                        Mostrando {tarefas.from} de {tarefas.to} de {tarefas.total} resultados
                    </div>{' '}
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(tarefas.current_page - 1)}
                            disabled={tarefas.current_page === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>{' '}
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: tarefas.last_page }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={page === tarefas.current_page ? 'default' : 'outline'}
                                    size="icon"
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>{' '}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(tarefas.current_page + 1)}
                            disabled={tarefas.current_page === tarefas.last_page}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>{' '}
                    </div>{' '}
                </div>{' '}
            </div>{' '}
        </AppLayout>
    );
}
