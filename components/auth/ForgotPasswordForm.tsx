'use client';

import { useState, type FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthInput } from './AuthInput';
import { AuthError } from './AuthError';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send the reset link.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <p className="text-sm leading-[1.65] text-ink">
        If <span className="text-accent">{email}</span> exists on the Apex login, a reset
        link is on its way. Check your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={submit}>
      <AuthInput
        label="Email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@operator.so"
      />
      {error && <AuthError message={error} />}
      <button type="submit" disabled={busy} className="cta-primary w-full justify-center">
        <span>{busy ? 'Sending…' : 'Send reset link'}</span>
      </button>
    </form>
  );
}
