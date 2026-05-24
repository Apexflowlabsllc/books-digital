'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { AuthInput } from './AuthInput';
import { AuthError } from './AuthError';

export function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
        },
      });
      if (error) throw error;
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't sign you up.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div>
        <p className="eyebrow text-accent">✓ Check your inbox</p>
        <p className="mt-4 font-display text-3xl text-ink md:text-4xl">
          We sent a verify link to <span className="text-accent">{email}</span>.
        </p>
        <p className="mt-4 text-sm leading-[1.65] text-ink-dim">
          Click it and you&rsquo;re in. The session works on every Apex subdomain — sign in
          here, recognized at apexflowlabs.com, digital.apexflowlabs.com,
          books.apexflowlabs.com, all of them.
        </p>
      </div>
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
      <AuthInput
        label="Password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        hint="Eight characters or more. Don't make us regulate."
      />

      {error && <AuthError message={error} />}

      <button type="submit" disabled={busy} className="cta-primary w-full justify-center">
        <span>{busy ? 'Creating account…' : 'Create account'}</span>
      </button>

      <p className="mt-5 text-[12px] leading-[1.55] text-ink-mute">
        By creating an account you agree to our{' '}
        <Link href="/legal/terms" className="underline underline-offset-2 hover:text-ink">
          Terms
        </Link>{' '}
        and{' '}
        <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-ink">
          Privacy
        </Link>
        .
      </p>

      <p className="mt-6 text-sm text-ink-dim">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-accent hover:text-ink">
          Sign in →
        </Link>
      </p>
    </form>
  );
}
