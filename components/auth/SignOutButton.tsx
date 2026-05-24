'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface SignOutButtonProps {
  className?: string;
  label?: string;
}

export function SignOutButton({ className, label = 'Sign out' }: SignOutButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className={className ?? 'cta-secondary'}
    >
      <span>{busy ? 'Signing out…' : label}</span>
    </button>
  );
}
