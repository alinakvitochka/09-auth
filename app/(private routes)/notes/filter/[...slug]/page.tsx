import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes, type FetchNotesParams } from '../../../../../lib/api/serverApi';
import NotesClient from './Notes.client';

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
}

const tagLabels: Record<string, string> = {
  all: 'All notes',
  Todo: 'Todo notes',
  Work: 'Work notes',
  Personal: 'Personal notes',
  Meeting: 'Meeting notes',
  Shopping: 'Shopping notes',
};

export async function generateMetadata({ params }: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] ?? 'all';
  const label = tagLabels[tag] ?? `Notes tagged ${tag}`;

  return {
    title: `${label} | NoteHub`,
    description: `Browse and manage your ${label.toLowerCase()} in NoteHub`,
    openGraph: {
      title: `${label} | NoteHub`,
      description: `Browse and manage your ${label.toLowerCase()} in NoteHub`,
      url: `https://notehub.com/notes/filter/${tag}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `${label} | NoteHub`,
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  const tag = slug?.[0] ?? 'all';
  const cookieStore = await cookies();

  const queryClient = new QueryClient();

  const fetchParams: FetchNotesParams = {
    page: 1,
    perPage: 12,
    ...(tag !== 'all' ? { tag } : {}),
  };

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () => fetchNotes(cookieStore, fetchParams),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}