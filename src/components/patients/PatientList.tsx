import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { toastSuccess, useToast } from '@/hooks/use-toast';
import type { Patient, PatientFilters } from '@/types';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import PatientForm from './PatientForm';
import { Pencil, Ban } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

interface PatientListProps {
  filters?: PatientFilters;
}

const PatientList: React.FC<PatientListProps> = ({ filters }) => {
  const queryClient = useQueryClient();
  const { data: patients = [], isLoading } = useQuery<Patient[]>({
    queryKey: ['patients', filters],
    queryFn: () => apiService.getPatients(filters),
  });
  const { toast } = useToast();
  const deactivateMutation = useMutation({
    mutationFn: (cpf: string) => apiService.deactivatePatient(cpf),
    onSuccess: () => {
      toastSuccess({ title: 'Paciente inativado com sucesso!' });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (e: any) => {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    },
  });
  // Estado para edição
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCpf, setSelectedCpf] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading) return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-[600px] w-full bg-white border rounded-xl shadow text-xs md:text-sm">
        <thead className="bg-blue-50">
          <tr>
            <th className="px-2 md:px-4 py-2 text-blue-700 whitespace-nowrap">CPF</th>
            <th className="px-2 md:px-4 py-2 text-blue-700 whitespace-nowrap">Nome</th>
            <th className="px-2 md:px-4 py-2 text-blue-700 whitespace-nowrap">Status</th>
            <th className="px-2 md:px-4 py-2 text-blue-700 whitespace-nowrap">Ações</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, i) => (
            <tr key={i}>
              <td className="px-2 md:px-4 py-2"><Skeleton className="h-4 w-24" /></td>
              <td className="px-2 md:px-4 py-2"><Skeleton className="h-4 w-32" /></td>
              <td className="px-2 md:px-4 py-2"><Skeleton className="h-4 w-16" /></td>
              <td className="px-2 md:px-4 py-2"><Skeleton className="h-4 w-16" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  if (!patients.length) return <div className="text-gray-500">Nenhum paciente encontrado.</div>;

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-[600px] w-full bg-white border rounded-xl shadow text-xs md:text-sm">
        <thead className="bg-blue-50">
          <tr>
            <th className="px-2 md:px-4 py-2 text-blue-700 whitespace-nowrap">CPF</th>
            <th className="px-2 md:px-4 py-2 text-blue-700 whitespace-nowrap">Nome</th>
            <th className="px-2 md:px-4 py-2 text-blue-700 whitespace-nowrap">Status</th>
            <th className="px-2 md:px-4 py-2 text-blue-700 whitespace-nowrap">Ações</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.cpf} className="border-t hover:bg-blue-50/50 transition">
              <td className="px-2 md:px-4 py-2 font-mono break-all max-w-[180px] md:max-w-[220px] text-center">{p.cpf}</td>
              <td className="px-2 md:px-4 py-2 text-center">{p.name}</td>
              <td className={`px-2 md:px-4 py-2 font-semibold text-center ${p.isActive ? 'text-green-600' : 'text-gray-400'}`}>{p.isActive ? 'Ativo' : 'Inativo'}</td>
              <td className="px-2 md:px-4 py-2 text-center">
                <div className="flex gap-2 justify-center items-center">
                  <button
                    title="Editar"
                    className="p-2 rounded-full border border-blue-600 text-blue-700 bg-white hover:bg-blue-50 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={() => { setEditPatient(p); setEditOpen(true); }}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    title="Inativar"
                    className={`p-2 rounded-full border border-red-600 text-red-600 bg-white hover:bg-red-50 transition focus:outline-none focus:ring-2 focus:ring-red-400 ${!p.isActive ? 'opacity-50' : ''}`}
                    onClick={() => { if (p.isActive) { setSelectedCpf(p.cpf); setConfirmOpen(true); } }}
                    disabled={!p.isActive}
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                </div>
                <Dialog open={confirmOpen && selectedCpf === p.cpf} onOpenChange={setConfirmOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar inativação</DialogTitle>
                    </DialogHeader>
                    Tem certeza que deseja inativar este paciente?
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancelar</Button>
                      <Button variant="destructive" onClick={() => { deactivateMutation.mutate(p.cpf); setConfirmOpen(false); }}>Confirmar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal de edição */}
      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) setEditPatient(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Paciente</DialogTitle>
          </DialogHeader>
          {editPatient && (
            <PatientForm
              initialData={editPatient}
              mode="edit"
              onSuccess={() => {
                setEditOpen(false);
                setEditPatient(null);
                queryClient.invalidateQueries({ queryKey: ['patients'] });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientList;
