'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User as UserIcon, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface NavUserMenuProps {
  email: string;
}

export function NavUserMenu({ email }: NavUserMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onEsc);
    return () => {
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const signOut = async () => {
    if (busy) return;
    setBusy(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push('/');
    router.refresh();
  };

  const initial = email.charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(217,204,140,0.35)] bg-[#001428]/60 backdrop-blur-sm transition-colors hover:border-accent hover:bg-[#4A5C44]/40"
      >
        <span className="font-mono text-[12px] font-semibold uppercase text-accent">
          {initial}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 z-50 w-64 border border-[rgba(217,204,140,0.25)] bg-[#001428]/95 p-2 backdrop-blur-xl"
          style={{ boxShadow: '0 24px 60px -20px rgba(0,0,0,0.7)' }}
        >
          <div className="border-b border-[rgba(217,204,140,0.15)] px-3 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/70">
              Signed in
            </p>
            <p className="mt-1 truncate text-sm text-cream">{email}</p>
          </div>
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center gap-3 px-3 py-2.5 text-sm text-cream/90 transition-colors hover:bg-[rgba(217,204,140,0.08)] hover:text-cream"
          >
            <UserIcon className="h-4 w-4 text-accent" aria-hidden />
            <span>Your account</span>
          </Link>
          <button
            type="button"
            onClick={signOut}
            disabled={busy}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-cream/90 transition-colors hover:bg-[rgba(217,204,140,0.08)] hover:text-cream"
          >
            <LogOut className="h-4 w-4 text-accent" aria-hidden />
            <span>{busy ? 'Signing out…' : 'Sign out'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
