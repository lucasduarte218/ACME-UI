// Tipos globais do sistema de gestão de pacientes e atendimentos

export interface Patient {
  cpf: string;
  name: string;
  birthDate: string;
  gender: string;
  zipCode: string;
  city: string;
  district: string;
  address: string;
  complement?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Appointment {
  id: string;
  patientCpf: string;
  patient?: Patient;
  dateTime: string;
  description: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PatientFilters {
  name?: string;
  cpf?: string;
  isActive?: boolean;
}

export interface AppointmentFilters {
  start?: string;
  end?: string;
  patientCpf?: string;
  isActive?: boolean;
}
