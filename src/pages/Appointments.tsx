import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Search } from 'lucide-react';
import AppointmentForm from '@/components/appointments/AppointmentForm';
import AppointmentList from '@/components/appointments/AppointmentList';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DatePickerVisual } from '@/components/ui/datepicker-visual';
import { Select } from '@/components/ui/select';
import type { AppointmentFilters } from '@/types';

const Appointments: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<AppointmentFilters>({});
  const [form, setForm] = useState<AppointmentFilters>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, isActive: value === '' ? undefined : value === 'true' }));
  };

  const formatLocalDateTime = (date: Date | null) => {
    if (!date) return undefined;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const handleDate = (field: 'start' | 'end', date: Date | null) => {
    setForm((prev) => ({ ...prev, [field]: formatLocalDateTime(date) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(form);
  };

  return (
    <div className="space-y-8 px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Atendimentos</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600 text-white font-semibold shadow-md px-4 md:px-6 py-2 rounded-lg flex items-center gap-2 w-full md:w-auto justify-center">
              <Plus className="h-5 w-5" />Novo Atendimento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-green-700 drop-shadow font-bold">Cadastrar Atendimento</DialogTitle>
            </DialogHeader>
            <AppointmentForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <Card className="rounded-xl shadow p-4 md:p-6 bg-white overflow-x-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700"><Search className="h-5 w-5" />Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col md:flex-row gap-2 md:gap-4 flex-wrap items-end" onSubmit={handleSubmit}>
            <div className="min-w-[150px] flex-1">
              <Label htmlFor="start">Data Inicial</Label>
              <DatePickerVisual
                id="start"
                value={form.start ? new Date(form.start) : null}
                onChange={(date) => handleDate('start', date)}
                dateFormat="dd/MM/yyyy HH:mm"
                showTimeSelect
                placeholder="Data e hora inicial"
              />
            </div>
            <div className="min-w-[150px] flex-1">
              <Label htmlFor="end">Data Final</Label>
              <DatePickerVisual
                id="end"
                value={form.end ? new Date(form.end) : null}
                onChange={(date) => handleDate('end', date)}
                dateFormat="dd/MM/yyyy HH:mm"
                showTimeSelect
                placeholder="Data e hora final"
              />
            </div>
            <div className="min-w-[150px] flex-1">
              <Label htmlFor="paciente">Paciente</Label>
              <Input id="patientCpf" placeholder="CPF" className="bg-green-50 border-green-200 focus:border-green-400" value={form.patientCpf || ''} onChange={handleChange} />
            </div>
            <div className="min-w-[120px] flex-1">
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                options={[
                  { label: 'Ativo', value: 'true' },
                  { label: 'Inativo', value: 'false' },
                ]}
                value={form.isActive === undefined ? '' : form.isActive ? 'true' : 'false'}
                onChange={handleStatus}
                className="bg-green-50 border-green-200 focus:border-green-400"
                showAllOption={true}
                allLabel="Todos"
              />
            </div>
            <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-semibold w-full md:w-auto h-9 md:mb-0">Filtrar</Button>
          </form>
        </CardContent>
      </Card>
      <Card className="rounded-xl shadow p-4 md:p-6 bg-white overflow-x-auto">
        <CardHeader>
          <CardTitle className="text-green-700">Lista de Atendimentos</CardTitle>
        </CardHeader>
        <CardContent>
          <AppointmentList filters={filters} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Appointments;
