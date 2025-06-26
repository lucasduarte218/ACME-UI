import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Plus, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import type { Appointment } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';

const Home: React.FC = () => {
	const { data: dashboard, isLoading } = useQuery<{ totalPatients: number; activePatients: number }>(
		{
			queryKey: ['patient-dashboard'],
			queryFn: () => apiService.getPatientDashboard(),
		}
	);
	const { data: appointmentsDashboard, isLoading: isLoadingAppointments } = useQuery<
		{ totalAppointments: number; todayAppointments: number }
	>(
		{
			queryKey: ['appointments-dashboard'],
			queryFn: () => apiService.getAppointmentDashboard(),
		}
	);
	const { data: recentAppointments, isLoading: isLoadingRecent } = useQuery<Appointment[]>(
		{
			queryKey: ['recent-active-appointments'],
			queryFn: () => apiService.getRecentActiveAppointments(2),
		}
	);

	const stats = [
		{
			label: 'Total de Pacientes',
			value: dashboard?.totalPatients ?? (isLoading ? '...' : 0),
			color: 'bg-blue-600',
			icon: <Users className="h-6 w-6" />,
		},
		{
			label: 'Pacientes Ativos',
			value: dashboard?.activePatients ?? (isLoading ? '...' : 0),
			color: 'bg-green-500',
			icon: <Activity className="h-6 w-6" />,
		},
		{
			label: 'Total Atendimentos',
			value: appointmentsDashboard?.totalAppointments ?? (isLoadingAppointments ? '...' : 0),
			color: 'bg-purple-500',
			icon: <Calendar className="h-6 w-6" />,
		},
		{
			label: 'Hoje',
			value: appointmentsDashboard?.todayAppointments ?? (isLoadingAppointments ? '...' : 0),
			color: 'bg-orange-500',
			icon: <Plus className="h-6 w-6" />,
		},
	];

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-4xl font-bold text-gray-900 mb-1">Dashboard</h1>
				<p className="text-gray-600 text-lg">Visão geral do sistema de atendimentos</p>
			</div>
			{isLoading ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
					{[...Array(4)].map((_, i) => (
						<Skeleton key={i} className="h-24 w-full rounded-xl" />
					))}
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
					{stats.map((stat) => (
						<div
							key={stat.label}
							className={`rounded-xl shadow-md p-4 md:p-5 flex flex-col items-start ${stat.color} text-white min-w-0`}
						>
							<div className="flex items-center gap-2 mb-2">
								{stat.icon}
								<span className="font-semibold text-base md:text-lg truncate">{stat.label}</span>
							</div>
							<span className="text-2xl md:text-3xl font-bold">{stat.value}</span>
						</div>
					))}
				</div>
			)}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
				<div className="bg-white rounded-xl shadow p-4 md:p-6">
					<h2 className="text-lg md:text-xl font-bold mb-2">Ações Rápidas</h2>
					<p className="text-gray-500 mb-4">Acesso rápido às principais funcionalidades</p>
					<div className="flex flex-col gap-2">
						<Link to="/patients">
							<button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition text-sm md:text-base">
								<Users className="h-5 w-5" /> Tela Pacientes
							</button>
						</Link>
						<Link to="/appointments">
							<button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 font-medium transition text-sm md:text-base">
								<Calendar className="h-5 w-5" /> Tela Atendimentos
							</button>
						</Link>
					</div>
				</div>
				<div className="bg-white rounded-xl shadow p-4 md:p-6">
					<h2 className="text-lg md:text-xl font-bold mb-2">Atendimentos Recentes</h2>
					<p className="text-gray-500 mb-4">Ativos nas últimas 2 horas</p>
					{isLoadingRecent ? (
						<ul className="space-y-2">
							{[...Array(3)].map((_, i) => (
								<li key={i} className="flex gap-2 items-center">
									<Skeleton className="h-5 w-32" />
									<Skeleton className="h-5 w-24" />
								</li>
							))}
						</ul>
					) : recentAppointments && recentAppointments.length > 0 ? (
						<ul className="divide-y divide-gray-200">
							{recentAppointments.map((a) => (
								<li key={a.id} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
									<span className="font-semibold text-blue-700" title={a.patientCpf}>{a.patientCpf}</span>
									<span className="text-sm text-gray-500" title={new Date(a.dateTime).toLocaleString('pt-BR', {day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'})}>
										{new Date(a.dateTime).toLocaleString('pt-BR', {
											day: '2-digit',
											month: '2-digit',
											year: '2-digit',
											hour: '2-digit',
											minute: '2-digit',
										})}
									</span>
								</li>
							))}
						</ul>
					) : (
						<div className="text-gray-400">Nenhum atendimento ativo recente</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Home;
