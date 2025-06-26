import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { apiService } from '@/services/api';
import { toastSuccess, useToast } from '@/hooks/use-toast';
import type { Patient } from '@/types';
import { DatePickerVisual } from '@/components/ui/datepicker-visual';
import { Select } from '@/components/ui/select';

const patientSchema = z.object({
  cpf: z.string().min(11, 'CPF obrigatório').max(14, 'CPF inválido'),
  name: z.string().min(2, 'Nome obrigatório'),
  birthDate: z.string(),
  gender: z.string(),
  zipCode: z.string(),
  city: z.string(),
  district: z.string(),
  address: z.string(),
  complement: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

interface PatientFormProps {
  onSuccess?: () => void;
  initialData?: Patient;
  mode?: 'create' | 'edit';
}

const PatientForm: React.FC<PatientFormProps> = ({ onSuccess, initialData, mode = 'create' }) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: initialData ? {
      ...initialData,
      birthDate: initialData.birthDate ? initialData.birthDate.split('T')[0] : '',
      gender: initialData.gender || '',
    } : {
      cpf: '',
      name: '',
      birthDate: '',
      gender: '',
      zipCode: '',
      city: '',
      district: '',
      address: '',
      complement: '',
    },
  });

  const { toast } = useToast();

  React.useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        birthDate: initialData.birthDate ? initialData.birthDate.split('T')[0] : '',
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: PatientFormValues) => {
    console.log('SUBMIT', data);
    try {
      if (mode === 'edit' && initialData) {
        await apiService.updatePatient(initialData.cpf, {
          ...data,
          cpf: initialData.cpf, // garantir cpf correto
        });
        toastSuccess({ title: 'Sucesso', description: 'Paciente atualizado com sucesso!' });
        onSuccess?.();
        return;
      }
      // Verifica se já existe paciente com o mesmo CPF
      const existing = await apiService.getPatients({ cpf: data.cpf });
      if (existing.length > 0) {
        toast({ title: 'Erro', description: 'CPF já cadastrado!', variant: 'destructive' });
        return;
      }
      await apiService.createPatient({ ...data, isActive: true });
      toastSuccess({ title: 'Sucesso', description: 'Paciente cadastrado com sucesso!' });
      reset();
      onSuccess?.();
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message || 'Erro ao cadastrar paciente', variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-black">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cpf">CPF</Label>
          <Input id="cpf" {...register('cpf')} disabled={mode === 'edit'} />
          {errors.cpf && <span className="text-red-500 text-xs">{errors.cpf.message}</span>}
        </div>
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
        </div>
        <div>
          <Label htmlFor="birthDate">Data de Nascimento</Label>
          <Controller
            control={control}
            name="birthDate"
            render={({ field }) => (
              <DatePickerVisual
                id="birthDate"
                value={field.value ? new Date(field.value) : null}
                onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                dateFormat="dd/MM/yyyy"
                placeholder="Selecione a data"
              />
            )}
          />
        </div>
        <div>
          <Label htmlFor="gender">Gênero</Label>
          <Select
            id="gender"
            {...register('gender')}
            options={[
              { label: 'Masculino', value: 'Masculino' },
              { label: 'Feminino', value: 'Feminino' },
              { label: 'Não definido', value: 'Não definido' },
            ]}
            className="bg-blue-50 border-blue-200 focus:border-blue-400"
            showAllOption={false}
          />
        </div>
        <div>
          <Label htmlFor="zipCode">CEP</Label>
          <Input id="zipCode" {...register('zipCode')} />
        </div>
        <div>
          <Label htmlFor="city">Cidade</Label>
          <Input id="city" {...register('city')} />
        </div>
        <div>
          <Label htmlFor="district">Bairro</Label>
          <Input id="district" {...register('district')} />
        </div>
        <div>
          <Label htmlFor="address">Endereço</Label>
          <Input id="address" {...register('address')} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input id="complement" {...register('complement')} />
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
        {isSubmitting ? 'Salvando...' : mode === 'edit' ? 'Salvar Alterações' : 'Salvar Paciente'}
      </Button>
    </form>
  );
};

export default PatientForm;
