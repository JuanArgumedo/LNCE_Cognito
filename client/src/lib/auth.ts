import { apiRequest } from "./queryClient";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  name: string;
  role?: string;
}

export async function login(credentials: LoginCredentials) {
  const response = await apiRequest('POST', '/api/auth/login', credentials);
  return response.json();
}

export async function register(data: RegisterData) {
  const response = await apiRequest('POST', '/api/auth/register', data);
  return response.json();
}

export async function verifyToken() {
  const response = await apiRequest('GET', '/api/auth/verify');
  return response.json();
}
