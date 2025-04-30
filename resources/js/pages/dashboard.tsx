import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Clock, List, Plus } from 'lucide-react';

interface Props {
    stats?: {
        totalListas: number;
        totalTarefas: number;
        completedTarefas: number;
        pendingTarefas: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({
    stats = {
        totalListas: 0,
        totalTarefas: 0,
        completedTarefas: 0,
        pendingTarefas: 0,
    },
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="from-background to-muted/20 flex h-full flex-1 flex-col gap-6 rounded-xl bg-gradient-to-br p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>{' '}
                        <p className="text-muted-foreground mt-1">Bem-vindo de volta! Aqui está sua visão geral</p>{' '}
                    </div>{' '}
                    <div className="flex gap-2">
                        <Link href={route('listas.index')}>
                            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg">
                                <List className="mr-2 h-4 w-4" />
                                Ver listas
                            </Button>{' '}
                        </Link>{' '}
                        <Link href={route('tarefas.index')}>
                            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Ver Tarefas
                            </Button>{' '}
                        </Link>{' '}
                    </div>{' '}
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-600/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-500">Total Listas</CardTitle>{' '}
                            <List className="h-4 w-4 text-blue-500" />
                        </CardHeader>{' '}
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-500">{stats.totalListas}</div>{' '}
                            <p className="text-muted-foreground text-xs">Suas Listas</p>{' '}
                        </CardContent>{' '}
                    </Card>
                    <Card className="border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-600/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-green-500">Total Tarefas</CardTitle>{' '}
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>{' '}
                        <CardContent>
                            <div className="text-2xl font-bold text-green-500">{stats.totalTarefas}</div>{' '}
                            <p className="text-muted-foreground text-xs">Todas as Tarefas</p>
                        </CardContent>{' '}
                    </Card>
                    <Card className="border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-yellow-500">Tarefas Pendentes</CardTitle>{' '}
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>{' '}
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-500">{stats.pendingTarefas}</div>{' '}
                            <p className="text-muted-foreground text-xs">Tarefas a serem concluídas </p>
                        </CardContent>{' '}
                    </Card>
                    <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-600/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-purple-500">Tarefas completas</CardTitle>{' '}
                            <AlertCircle className="h-4 w-4 text-purple-500" />
                        </CardHeader>{' '}
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-500">{stats.completedTarefas}</div>{' '}
                            <p className="text-muted-foreground text-xs">Tarefas Completas</p>
                        </CardContent>{' '}
                    </Card>{' '}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-lg">Ações rapidas</CardTitle>{' '}
                        </CardHeader>{' '}
                        <CardContent>
                            <div className="grid gap-4">
                                <Link href={route('listas.index')}>
                                    <Button variant="outline" className="w-full justify-start">
                                        <List className="mr-2 h-4 w-4" />
                                        Ver tudo
                                    </Button>{' '}
                                </Link>{' '}
                                <Link href={route('tarefas.index')}>
                                    <Button variant="outline" className="w-full justify-start">
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Ver tudo
                                    </Button>{' '}
                                </Link>{' '}
                            </div>{' '}
                        </CardContent>{' '}
                    </Card>
                    <Card className="border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-lg">Atividades recentes</CardTitle>{' '}
                        </CardHeader>{' '}
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary/10 rounded-full p-2">
                                        <Plus className="text-primary h-4 w-4" />
                                    </div>{' '}
                                    <div>
                                        <p className="text-sm font-medium">Bem-vindo ao Gerenciador de Tarefas</p>{' '}
                                        <p className="text-muted-foreground text-xs">Vamos começar criando sua primeira lista ou tarefa </p>
                                    </div>{' '}
                                </div>{' '}
                            </div>{' '}
                        </CardContent>{' '}
                    </Card>{' '}
                </div>{' '}
            </div>{' '}
        </AppLayout>
    );
}
