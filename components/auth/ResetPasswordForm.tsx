'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AuthInput } from './AuthInput';
import { AuthError } from './AuthError';

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.push('/account');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't update your password.");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <AuthInput
        label="New password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <AuthInput
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />
      {error && <AuthError message={error} />}
      <button type="submit" disabled={busy} className="cta-primary w-full justify-center">
        <span>{busy ? 'Updating…' : 'Set new password'}</span>
      </button>
    </form>
  );
}
