import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { toastSuccess, useToast } from '@/hooks/use-toast';
import type { Appointment, AppointmentFilters } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Pencil, Ban } from 'lucide-react';
import AppointmentForm from './AppointmentForm';
import { Skeleton } from '@/components/ui/Skeleton';

// Utilitário para formatação de datas
export function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

interface AppointmentListProps {
  filters?: AppointmentFilters;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ filters }) => {
  const queryClient = useQueryClient();
  const { data: appointments = [], isLoading } = useQuery<Appointment[]>({
    queryKey: ['appointments', filters],
    queryFn: () => apiService.getAppointments(filters),
  });
  const { toast } = useToast();
  const deactivateMutation = useMutation({
    mutationFn: (id: string) => apiService.deactivateAppointment(id),
    onSuccess: () => {
      toastSuccess({ title: 'Atendimento inativado com sucesso!' });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (e: any) => {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    },
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editAppointment, setEditAppointment] = useState<Appointment | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  if (isLoading) return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[600px] w-full bg-white border rounded-xl shadow text-xs md:text-sm">
        <thead className="bg-green-50">
          <tr>
            <th className="px-1 md:px-4 py-2 text-green-700 whitespace-nowrap">Paciente CPF</th>
            <th className="px-1 md:px-4 py-2 text-green-700 whitespace-nowrap">Data/Hora</th>
            <th className="px-1 md:px-4 py-2 text-green-700 whitespace-nowrap">Descrição</th>
            <th className="px-1 md:px-4 py-2 text-green-700 whitespace-nowrap">Status</th>
            <th className="px-1 md:px-4 py-2 text-green-700 whitespace-nowrap">Ações</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, i) => (
            <tr key={i}>
              <td className="px-1 md:px-4 py-2"><Skeleton className="h-4 w-24" /></td>
              <td className="px-1 md:px-4 py-2"><Skeleton className="h-4 w-20" /></td>
              <td className="px-1 md:px-4 py-2"><Skeleton className="h-4 w-32" /></td>
              <td className="px-1 md:px-4 py-2"><Skeleton className="h-4 w-12" /></td>
              <td className="px-1 md:px-4 py-2"><Skeleton className="h-4 w-16" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  if (!appointments.length) return <div className="text-gray-500">Nenhum atendimento encontrado.</div>;

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[600px] w-full bg-white border rounded-xl shadow text-xs md:text-sm">
        <thead className="bg-green-50">
          <tr>
            <th className="px-1 md:px-4 py-2 text-green-700 whitespace-nowrap">Paciente CPF</th>
            <th className="px-1 md:px-4 py-2 text-green-700 whitespace-nowrap">Data/Hora</th>
            <th className="px-1 md:px-4 py-2 text-green-700 whitespace-nowrap">Descrição</th>
            <th className="px-1 md:px-4 py-2 text-green-700 whitespace-nowrap">Status</th>
            <th className="px-1 md:px-4 py-2 text-green-700 whitespace-nowrap">Ações</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.id} className="border-t hover:bg-green-50/50 transition">
              <td className="px-1 md:px-4 py-2 text-center break-words max-w-[120px]">{a.patient?.name || a.patientCpf}</td>
              <td className="px-1 md:px-4 py-2 font-mono break-words max-w-[120px] md:max-w-[220px] text-center">{formatDate(a.dateTime)}</td>
              <td className="px-1 md:px-4 py-2 text-center break-words max-w-[140px] truncate group relative">
                <span title={a.description} className="block max-w-[120px] truncate cursor-pointer group-hover:underline">
                  {a.description}
                </span>
                {a.description && a.description.length > 30 && (
                  <div className="absolute left-1/2 z-10 hidden group-hover:block bg-white border border-gray-300 rounded shadow-lg p-2 text-xs text-gray-800 min-w-[180px] max-w-xs -translate-x-1/2 top-full mt-1 whitespace-pre-line">
                    {a.description}
                  </div>
                )}
              </td>
              <td className={`px-1 md:px-4 py-2 font-semibold text-center ${a.isActive ? 'text-purple-600' : 'text-gray-400'}`}>{a.isActive ? 'Ativo' : 'Inativo'}</td>
              <td className="px-1 md:px-4 py-2 text-center">
                <div className="flex gap-1 md:gap-2 justify-center items-center flex-wrap">
                  {/* Acessibilidade: aria-label nos botões */}
                  <button
                    title="Editar"
                    aria-label="Editar atendimento"
                    className="p-2 rounded-full border border-green-600 text-green-700 bg-white hover:bg-green-50 transition focus:outline-none focus:ring-2 focus:ring-green-400"
                    onClick={() => { setEditAppointment(a); setEditOpen(true); }}
                  >
                    <Pencil className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    title="Inativar"
                    aria-label={a.isActive ? "Inativar atendimento" : "Atendimento já inativo"}
                    className={`p-2 rounded-full border border-red-600 text-red-600 bg-white hover:bg-red-50 transition focus:outline-none focus:ring-2 focus:ring-red-400 ${!a.isActive ? 'opacity-50' : ''}`}
                    onClick={() => { if (a.isActive) { setSelectedId(a.id); setConfirmOpen(true); } }}
                    disabled={!a.isActive}
                  >
                    <Ban className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
                <Dialog open={confirmOpen && selectedId === a.id} onOpenChange={setConfirmOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar inativação</DialogTitle>
                    </DialogHeader>
                    Tem certeza que deseja inativar este atendimento?
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancelar</Button>
                      <Button variant="destructive" onClick={() => { deactivateMutation.mutate(a.id); setConfirmOpen(false); }}>Confirmar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal de edição */}
      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) setEditAppointment(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Atendimento</DialogTitle>
          </DialogHeader>
          {editAppointment && (
            <AppointmentForm
              initialData={editAppointment}
              mode="edit"
              onSuccess={() => {
                setEditOpen(false);
                setEditAppointment(null);
                queryClient.invalidateQueries({ queryKey: ['appointments'] });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AppointmentList;
