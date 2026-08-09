import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNoteById } from '../../../../lib/api/serverApi';
import NoteDetailsClient from './NoteDetails.client';

interface NoteDetailsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NoteDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const cookieStore = await cookies();

  let note;
  try {
    note = await fetchNoteById(cookieStore, id);
  } catch {
    return {
      title: 'Note not found | NoteHub',
      description: 'The note you are looking for does not exist.',
    };
  }

  return {
    title: `${note.title} | NoteHub`,
    description: note.content.slice(0, 160),
    openGraph: {
      title: `${note.title} | NoteHub`,
      description: note.content.slice(0, 160),
      url: `https://notehub.com/notes/${id}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
    },
  };
}

export default async function NoteDetailsPage({ params }: NoteDetailsPageProps) {
  const { id } = await params;
  const cookieStore = await cookies();

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(cookieStore, id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}