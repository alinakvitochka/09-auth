'use client';

import css from './App.module.css';

export interface AppProps {
  searchBox: React.ReactNode;
  pagination: React.ReactNode;
  createButton: React.ReactNode;
  noteList: React.ReactNode;
  isLoading: boolean;
  error: Error | null;
}

export default function App({
  searchBox,
  pagination,
  createButton,
  noteList,
  isLoading,
  error,
}: AppProps) {
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <div className={css.toolbarLeft}>{searchBox}</div>
        <div className={css.toolbarCenter}>{pagination}</div>
        <div className={css.toolbarRight}>
          {createButton}
        </div>
      </header>

      {noteList}
      {isLoading && <p className={css.loading}>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}