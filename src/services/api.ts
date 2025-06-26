import { API_BASE_URL } from '@/config/api';
import type { Patient, Appointment, PatientFilters, AppointmentFilters } from '@/types';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      if (response.status === 400) {
        const text = await response.text();
        throw new Error(text);
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Patients API
  async getPatients(filters?: PatientFilters): Promise<Patient[]> {
    const params = new URLSearchParams();
    if (filters?.name) params.append('name', filters.name);
    if (filters?.cpf) params.append('cpf', filters.cpf);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<Patient[]>(`/patients${query}`);
  }

  async createPatient(patient: Omit<Patient, 'createdAt' | 'updatedAt'>): Promise<Patient> {
    return this.request<Patient>('/patients', {
      method: 'POST',
      body: JSON.stringify(patient),
    });
  }

  async updatePatient(cpf: string, patient: Partial<Patient>): Promise<Patient> {
    return this.request<Patient>(`/patients/${cpf}`, {
      method: 'PUT',
      body: JSON.stringify(patient),
    });
  }

  async deactivatePatient(cpf: string): Promise<void> {
    return this.request<void>(`/patients/${cpf}/deactivate`, {
      method: 'PATCH',
    });
  }

  async getPatientDashboard(): Promise<{ totalPatients: number; activePatients: number }> {
    return this.request<{ totalPatients: number; activePatients: number }>(`/patients/dashboard`);
  }

  // Appointments API
  async getAppointments(filters?: AppointmentFilters): Promise<Appointment[]> {
    const params = new URLSearchParams();
    if (filters?.start) params.append('start', filters.start);
    if (filters?.end) params.append('end', filters.end);
    if (filters?.patientCpf) params.append('patientCpf', filters.patientCpf);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<Appointment[]>(`/appointments${query}`);
  }

  async createAppointment(appointment: { patientCpf: string; dateTime: string; description: string; isActive: boolean }): Promise<Appointment> {
    return this.request<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointment),
    });
  }

  async updateAppointment(id: string, appointment: { patientCpf: string; dateTime: string; description: string; isActive: boolean }): Promise<Appointment> {
    return this.request<Appointment>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ id, ...appointment }),
    });
  }

  async deactivateAppointment(id: string): Promise<void> {
    return this.request<void>(`/appointments/${id}/deactivate`, {
      method: 'PATCH',
    });
  }

  async getAppointmentDashboard(): Promise<{ totalAppointments: number; todayAppointments: number }> {
    return this.request<{ totalAppointments: number; todayAppointments: number }>(`/appointments/dashboard`);
  }

  async getRecentActiveAppointments(hours: number = 2): Promise<Appointment[]> {
    // Busca atendimentos ativos das últimas X horas
    const now = new Date();
    const start = new Date(now.getTime() - hours * 60 * 60 * 1000);
    // Monta string local no formato YYYY-MM-DDTHH:mm:ss
    const pad = (n: number) => n.toString().padStart(2, '0');
    const localString = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}T${pad(start.getHours())}:${pad(start.getMinutes())}:${pad(start.getSeconds())}`;
    const params = new URLSearchParams();
    params.append('start', localString);
    params.append('isActive', 'true');
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<Appointment[]>(`/appointments${query}`);
  }
}

export const apiService = new ApiService();
