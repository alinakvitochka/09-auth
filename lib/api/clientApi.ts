import type { Note } from '../../types/note';
import type { User } from '../../types/user';
import { api } from './api';

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: string;
}

export interface DeleteNoteResponse {
  id: string;
  title: string;
  content: string;
  tag: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  username: string;
  email: string;
  avatar: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  email: string;
  avatar: string;
}

export interface LogoutResponse {
  message: string;
}

export interface CheckSessionResponse {
  success: boolean;
}

export interface UpdateMeRequest {
  username?: string;
  email?: string;
}

// Notes
export const fetchNotes = async (
  params: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  const { tag, ...rest } = params;
  const queryParams = tag && tag !== 'all' ? { ...rest, tag } : rest;
  const response = await api.get<FetchNotesResponse>('/notes', {
    params: queryParams,
  });
  return response.data;
};

export const fetchNoteById = async (noteId: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${noteId}`);
  return response.data;
};

export const createNote = async (
  params: CreateNoteParams,
): Promise<Note> => {
  const response = await api.post<Note>('/notes', params);
  return response.data;
};

export const deleteNote = async (
  noteId: string,
): Promise<DeleteNoteResponse> => {
  const response = await api.delete<DeleteNoteResponse>(`/notes/${noteId}`);
  return response.data;
};

// Auth
export const register = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>('/auth/register', data);
  return response.data;
};

export const login = async (
  data: LoginRequest,
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', data);
  return response.data;
};

export const logout = async (): Promise<LogoutResponse> => {
  const response = await api.post<LogoutResponse>('/auth/logout');
  return response.data;
};

export const checkSession = async (): Promise<CheckSessionResponse> => {
  const response = await api.get<CheckSessionResponse>('/auth/session');
  return response.data;
};

// Users
export const getMe = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');
  return response.data;
};

export const updateMe = async (
  data: UpdateMeRequest,
): Promise<User> => {
  const response = await api.patch<User>('/users/me', data);
  return response.data;
};