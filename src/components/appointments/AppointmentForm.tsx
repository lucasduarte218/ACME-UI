import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { apiService } from '@/services/api';
import { toastSuccess, useToast } from '@/hooks/use-toast';
import { DatePickerVisual } from '@/components/ui/datepicker-visual';
import { Select } from '@/components/ui/select';
import type { Appointment, Patient } from '@/types';

const appointmentSchema = z.object({
  patientCpf: z.string().min(11, 'CPF obrigatório'),
  dateTime: z.string(),
  description: z.string().min(5, 'Descrição obrigatória'),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  onSuccess?: () => void;
  initialData?: Appointment;
  mode?: 'create' | 'edit';
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ onSuccess, initialData, mode = 'create' }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  useEffect(() => {
    apiService.getPatients({ isActive: true }).then(setPatients);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: initialData ? {
      ...initialData,
      dateTime: initialData.dateTime ? initialData.dateTime : '',
    } : {},
  });

  const { toast } = useToast();

  useEffect(() => {
    if (initialData && patients.length > 0) {
      // Se o paciente do agendamento não estiver na lista (ex: inativo), adiciona temporariamente
      const exists = patients.some(p => p.cpf === initialData.patientCpf);
      if (!exists) {
        setPatients(prev => [
          { cpf: initialData.patientCpf, name: initialData.patient?.name || initialData.patientCpf, birthDate: '', gender: '', zipCode: '', city: '', district: '', address: '', isActive: false },
          ...prev,
        ]);
      }
      reset({
        ...initialData,
        dateTime: initialData.dateTime ? initialData.dateTime : '',
      });
    }
  }, [initialData, reset, patients]);

  const onSubmit = async (data: AppointmentFormValues) => {
    try {
      if (mode === 'edit' && initialData) {
        await apiService.updateAppointment(initialData.id, {
          ...data,
          isActive: initialData.isActive,
        });
        toastSuccess({ title: 'Sucesso', description: 'Atendimento atualizado com sucesso!' });
        onSuccess?.();
        return;
      }
      await apiService.createAppointment({ ...data, isActive: true });
      toastSuccess({ title: 'Sucesso', description: 'Atendimento cadastrado com sucesso!' });
      reset();
      onSuccess?.();
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message || 'Erro ao cadastrar atendimento', variant: 'destructive' });
    }
  };

  function formatLocalDateTime(date: Date | null) {
    if (!date) return '';
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-black">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="patientCpf">Paciente</Label>
          <Select
            id="patientCpf"
            {...register('patientCpf')}
            options={patients.map(p => ({ label: `${p.name} (${p.cpf})`, value: p.cpf }))}
            className="bg-green-50 border-green-200 focus:border-green-400"
            disabled={mode === 'edit'}
          />
          {errors.patientCpf && <span className="text-red-500 text-xs">{errors.patientCpf.message}</span>}
        </div>
        <div>
          <Label htmlFor="dateTime">Data/Hora</Label>
          <Controller
            control={control}
            name="dateTime"
            render={({ field }) => (
              <DatePickerVisual
                id="dateTime"
                showTimeSelect
                value={field.value ? new Date(field.value) : null}
                onChange={(date) => field.onChange(formatLocalDateTime(date))}
                dateFormat="dd/MM/yyyy HH:mm"
                placeholder="Selecione a data e hora"
              />
            )}
          />
          {errors.dateTime && <span className="text-red-500 text-xs">{errors.dateTime.message}</span>}
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea id="description" {...register('description')} rows={4} />
          {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting} className="bg-green-500 hover:bg-green-600 text-white font-semibold">
        {isSubmitting ? 'Salvando...' : mode === 'edit' ? 'Salvar Alterações' : 'Salvar Atendimento'}
      </Button>
    </form>
  );
};

export default AppointmentForm;
