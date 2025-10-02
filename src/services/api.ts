const API_BASE_URL = 'https://85804b720d36.ngrok-free.app/api';

// Tipos
export interface LoginRequest {
  cpf: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    nome: string;
    email: string;
    tipo: 'aluno' | 'responsavel' | 'admin' | 'professor';
    aluno?: {
      id: number;
      matricula: string;
      cpf: string;
      telefone: string;
      curso: string;
      turma: string;
      modalidade: 'integrado' | 'subsequente';
    };
    responsavel?: {
      id: number;
      cpf: string;
      telefone: string;
    };
    professor?: {
      id: number;
      cpf: string;
      telefone: string;
    };
    alunosResponsaveis?: Array<{
      id: number;
      nome: string;
      matricula: string;
      curso: string;
      turma: string;
      modalidade: 'integrado' | 'subsequente';
      parentesco: string;
    }>;
  };
}

export interface Student {
  id: number;
  nome: string;
  matricula: string;
  cpf: string;
  email: string;
  telefone: string;
  curso: string;
  turma: string;
  modalidade: 'integrado' | 'subsequente';
  currentClass?: {
    subject: string;
    teacher: string;
    room: string;
    time: string;
    block: string;
    type: string;
  };
}

export interface Room {
  id: number;
  numero: string;
  bloco: string;
  andar: number;
  capacidade: number;
  tipo: string;
  status: 'disponivel' | 'ocupada';
  aula_atual?: string;
  professor_atual?: string;
  alunos_presentes?: number;
  mapa_x?: number | null;
  mapa_y?: number | null;
  mapa_bloco_id?: string | null;
  proximas_aulas?: Array<{
    hora_inicio: string;
    hora_fim: string;
    disciplina: string;
    professor: string;
    tipo: string;
  }>;
}

export interface Schedule {
  [key: string]: Array<{
    time: string;
    subject: string;
    teacher: string;
    room: string;
    type: string;
  }>;
}

// Classe para gerenciar a API
class ApiService {
  private token: string | null = null;

  constructor() {
    // Recuperar token do localStorage na inicialização
    this.token = localStorage.getItem('auth_token');
  }

  // Configurar token de autenticação
  setAuthToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  // Remover token
  clearAuthToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Método genérico para fazer requisições
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Métodos de autenticação
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    this.setAuthToken(response.token);
    return response;
  }

  async verifyToken(): Promise<{ user: LoginResponse['user'] }> {
    return this.request<{ user: LoginResponse['user'] }>('/auth/verify');
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearAuthToken();
    }
  }

  // Métodos para alunos
  async getAccessibleStudents(): Promise<Student[]> {
    return this.request<Student[]>('/students/accessible/list');
  }

  async getStudent(studentId: number): Promise<Student> {
    return this.request<Student>(`/students/${studentId}`);
  }

  async searchStudents(query: string): Promise<Student[]> {
    const params = new URLSearchParams();
    const endpoint = `/students/search?q=${encodeURIComponent(query)}`;
    return this.request<Student[]>(endpoint);
  }

  // Métodos para salas
  async getRooms(testTime?: string): Promise<Room[]> {
    const params = testTime ? `?testTime=${encodeURIComponent(testTime)}` : '';
    return this.request<Room[]>(`/rooms${params}`);
  }

  async getRoom(roomId: number, testTime?: string): Promise<Room> {
    const params = testTime ? `?testTime=${encodeURIComponent(testTime)}` : '';
    return this.request<Room>(`/rooms/${roomId}${params}`);
  }

  async searchRooms(query: string, filters?: {
    bloco?: string;
    tipo?: string;
    disponivel?: boolean;
    testTime?: string;
  }): Promise<Room[]> {
    const params = new URLSearchParams();
    if (filters?.bloco) params.append('bloco', filters.bloco);
    if (filters?.tipo) params.append('tipo', filters.tipo);
    if (filters?.disponivel !== undefined) {
      params.append('disponivel', filters.disponivel.toString());
    }
    if (filters?.testTime) params.append('testTime', filters.testTime);

    const queryString = params.toString();
    const endpoint = `/rooms/search/${encodeURIComponent(query)}${queryString ? `?${queryString}` : ''}`;
    
    return this.request<Room[]>(endpoint);
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Métodos genéricos para usar nos componentes
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // Métodos para professores
  async getTeacherClasses(): Promise<any> {
    return this.request<any>('/teachers/classes');
  }

  async getTeacherStudents(): Promise<any[]> {
    return this.request<any[]>('/teachers/students');
  }

  async getTeacherDisciplineStudents(disciplineId: number): Promise<any[]> {
    return this.request<any[]>(`/teachers/classes/${disciplineId}/students`);
  }
}

// Instância singleton da API
export const apiService = new ApiService();

// Funções de conveniência para usar nos componentes
export const api = {
  // Auth
  login: (credentials: LoginRequest) => apiService.login(credentials),
  logout: () => apiService.logout(),
  verifyToken: () => apiService.verifyToken(),
  isAuthenticated: () => apiService.isAuthenticated(),

  // Generic methods
  get: <T>(endpoint: string) => apiService.get<T>(endpoint),
  post: <T>(endpoint: string, data?: any) => apiService.post<T>(endpoint, data),

  // Students
  getAccessibleStudents: () => apiService.getAccessibleStudents(),
  getStudent: (id: number) => apiService.getStudent(id),
  searchStudents: (query: string) => apiService.searchStudents(query),
  getStudentSchedule: (studentId: number) => 
    apiService.get<any[]>(`/students/${studentId}/schedule`),

  // Rooms
  getRooms: (testTime?: string) => apiService.getRooms(testTime),
  getRoom: (id: number, testTime?: string) => apiService.getRoom(id, testTime),
  searchRooms: (query: string, filters?: Parameters<typeof apiService.searchRooms>[1]) => 
    apiService.searchRooms(query, filters),

  // Teachers
  getTeacherClasses: () => apiService.getTeacherClasses(),
  getTeacherStudents: () => apiService.getTeacherStudents(),
  getTeacherDisciplineStudents: (disciplineId: number) => apiService.getTeacherDisciplineStudents(disciplineId),
};