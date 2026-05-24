'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AuthInput } from './AuthInput';
import { AuthError } from './AuthError';

type Mode = 'magic' | 'password';

export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') ?? '/account';

  const [mode, setMode] = useState<Mode>('magic');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      if (mode === 'magic') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (error) throw error;
        setMagicSent(true);
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't sign you in. Try again.");
    } finally {
      setBusy(false);
    }
  };

  if (magicSent) {
    return (
      <div>
        <p className="eyebrow text-accent">✓ Magic link sent</p>
        <p className="mt-4 font-display text-3xl text-ink md:text-4xl">
          Check <span className="text-accent">{email}</span>.
        </p>
        <p className="mt-4 text-sm leading-[1.65] text-ink-dim">
          Click the link from any device — your session works on every Apex subdomain.
          Didn&rsquo;t see it in 60s? Check spam, then{' '}
          <button
            type="button"
            onClick={() => {
              setMagicSent(false);
              setEmail('');
            }}
            className="underline underline-offset-2 text-accent hover:text-ink"
          >
            try again
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <div className="mb-6 flex items-center gap-1 border border-line bg-bg-subtle p-1 text-[12px]">
        {(['magic', 'password'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className="flex-1 px-3 py-2 font-mono uppercase tracking-widest transition-colors"
            style={{
              background: mode === m ? 'rgba(217,204,140,0.14)' : 'transparent',
              color: mode === m ? 'var(--color-accent, #d9cc8c)' : 'inherit',
            }}
          >
            {m === 'magic' ? 'Magic link' : 'Password'}
          </button>
        ))}
      </div>

      <AuthInput
        label="Email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@operator.so"
      />

      {mode === 'password' && (
        <AuthInput
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      )}

      <div className="mb-6 flex items-center justify-between text-[13px]">
        {mode === 'password' ? (
          <Link href="/forgot-password" className="text-ink-mute hover:text-ink">
            Forgot password?
          </Link>
        ) : (
          <span className="text-[12px] text-ink-mute">
            One click in your inbox. No password to forget.
          </span>
        )}
        <Link href="/sign-up" className="text-accent hover:text-ink">
          New here? Create an account →
        </Link>
      </div>

      {error && <AuthError message={error} />}

      <button type="submit" disabled={busy} className="cta-primary w-full justify-center">
        <span>
          {busy
            ? mode === 'magic'
              ? 'Sending link…'
              : 'Signing in…'
            : mode === 'magic'
              ? 'Email me a magic link'
              : 'Sign in'}
        </span>
      </button>
    </form>
  );
}
