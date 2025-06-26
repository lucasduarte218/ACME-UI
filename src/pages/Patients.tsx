import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Search } from 'lucide-react';
import PatientForm from '@/components/patients/PatientForm';
import PatientList from '@/components/patients/PatientList';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
import type { PatientFilters } from '@/types';

const Patients: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<PatientFilters>({});
  const [form, setForm] = useState<PatientFilters>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, isActive: value === '' ? undefined : value === 'true' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(form);
  };

  return (
    <div className="space-y-8 px-2 md:px-0 w-full max-w-none">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Pacientes</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md px-4 md:px-6 py-2 rounded-lg flex items-center gap-2 w-full md:w-auto">
              <Plus className="h-5 w-5" />Novo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Paciente</DialogTitle>
            </DialogHeader>
            <PatientForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <Card className="rounded-xl shadow p-4 md:p-6 bg-white overflow-x-auto w-full max-w-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700"><Search className="h-5 w-5" />Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col md:flex-row gap-2 md:gap-4 flex-wrap items-end" onSubmit={handleSubmit}>
            <div className="min-w-[150px] flex-1">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" placeholder="Nome do paciente" className="bg-blue-50 border-blue-200 focus:border-blue-400" value={form.name || ''} onChange={handleChange} />
            </div>
            <div className="min-w-[120px] flex-1">
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" placeholder="CPF" className="bg-blue-50 border-blue-200 focus:border-blue-400" value={form.cpf || ''} onChange={handleChange} />
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
                className="bg-blue-50 border-blue-200 focus:border-blue-400"
              />
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full md:w-auto h-9 md:mb-0">Filtrar</Button>
          </form>
        </CardContent>
      </Card>
      <Card className="rounded-xl shadow p-4 md:p-6 bg-white overflow-x-auto w-full max-w-none">
        <CardHeader>
          <CardTitle className="text-blue-700">Lista de Pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientList filters={filters} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Patients;
