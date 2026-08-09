'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '../../../lib/api/clientApi';
import { useAuthStore } from '../../../lib/store/authStore';
import css from '../../../styles/SignUpPage.module.css';

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (formData: FormData) => {
    setError('');
    const values = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      const user = await register(values);
      setUser(user);
      router.push('/profile');
    } catch {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} action={handleSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Register
          </button>
        </div>

        <p className={css.error}>{error}</p>
      </form>
    </main>
  );
}