import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { CheckCircle2, Pencil, Plus, Trash2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Lista {
    id: number;
    titulo: string;
    descricao: string | null;
    tasks_count?: number;
}

interface Props {
    listas: Lista[];
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'listas',
        href: '/listas',
    },
];

export default function ListasIndex({ listas, flash }: Props) {
    const [isOpen, SetIsOpen] = useState(false);
    const [editingLista, setEditingLista] = useState<Lista | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

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
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingLista) {
            put(route('listas.update', editingLista.id), {
                onSuccess: () => {
                    SetIsOpen(false);
                    reset();
                    setEditingLista(null);
                },
            });
        } else {
            post(route('listas.store'), {
                onSuccess: () => {
                    SetIsOpen(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (lista: Lista) => {
        setEditingLista(lista);
        setData({
            titulo: lista.titulo,
            descricao: lista.descricao || '',
        });
        SetIsOpen(true);
    };

    const handleDelete = (listaId: number) => {
        destroy(route('listas.destroy', listaId));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Listas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
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
                    <h1 className="text-2xl font-bold">Listas</h1>{' '}
                    <Dialog open={isOpen} onOpenChange={SetIsOpen}>
                        <DialogTrigger>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New List
                            </Button>{' '}
                        </DialogTrigger>{' '}
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingLista ? 'Editar Lista' : 'Criar nova Lista'}</DialogTitle>{' '}
                            </DialogHeader>{' '}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="titulo">Title</Label>{' '}
                                    <Input id="titulo" value={data.titulo} onChange={(e) => setData('titulo', e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="descricao">Descricao</Label>{' '}
                                    <Textarea id="descricao" value={data.descricao} onChange={(e) => setData('descricao', e.target.value)} />
                                </div>{' '}
                                <Button type="submit" disabled={processing}>
                                    {editingLista ? 'Update' : 'Create'}
                                </Button>{' '}
                            </form>{' '}
                        </DialogContent>{' '}
                    </Dialog>{' '}
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {listas.map((lista) => (
                        <Card key={lista.id} className="hover:bg-accent/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-medium">{lista.titulo}</CardTitle>{' '}
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(lista)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>{' '}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(lista.id)}
                                        className="text-destructive hover:text-destructive/90"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>{' '}
                            <CardContent>
                                <p className="text-muted-foreground text-sm">{lista.descricao || 'Sem Descrição'}</p>
                                {lista.tasks_count !== undefined && (
                                    <p className="text-muted-foreground mt-2 text-sm">{lista.tasks_count} Tarefas </p>
                                )}
                            </CardContent>{' '}
                        </Card>
                    ))}
                </div>
            </div>{' '}
        </AppLayout>
    );
}
