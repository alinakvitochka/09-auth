import type { Note } from '../../types/note';
import type { User } from '../../types/user';
import { cookies } from 'next/headers';
import axios from 'axios';

const proxyBaseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

const proxyApi = axios.create({
  baseURL: proxyBaseURL,
});

// Server-side session check — returns full Axios response for proxy to access Set-Cookie headers
export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const res = await proxyApi.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};

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

export interface CheckSessionResponse {
  success: boolean;
}

const getHeaders = (cookieStore: Awaited<ReturnType<typeof import('next/headers').cookies>>) => ({
  Cookie: cookieStore.toString(),
});

// Notes
export const fetchNotes = async (
  cookieStore: Awaited<ReturnType<typeof import('next/headers').cookies>>,
  params: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  const { tag, ...rest } = params;
  const queryParams = tag && tag !== 'all' ? { ...rest, tag } : rest;
  const response = await proxyApi.get<FetchNotesResponse>('/notes', {
    params: queryParams,
    headers: getHeaders(cookieStore),
  });
  return response.data;
};

export const fetchNoteById = async (
  cookieStore: Awaited<ReturnType<typeof import('next/headers').cookies>>,
  noteId: string,
): Promise<Note> => {
  const response = await proxyApi.get<Note>(`/notes/${noteId}`, {
    headers: getHeaders(cookieStore),
  });
  return response.data;
};

// Auth
export const checkSession = async (
  cookieStore: Awaited<ReturnType<typeof import('next/headers').cookies>>,
): Promise<CheckSessionResponse> => {
  const response = await proxyApi.get<CheckSessionResponse>('/auth/session', {
    headers: getHeaders(cookieStore),
  });
  return response.data;
};

// Users
export const getMe = async (
  cookieStore: Awaited<ReturnType<typeof import('next/headers').cookies>>,
): Promise<User> => {
  const response = await proxyApi.get<User>('/users/me', {
    headers: getHeaders(cookieStore),
  });
  return response.data;
};