import { Nav } from './Nav';
import { Footer } from './Footer';
import { AuthorityFooter } from './AuthorityFooter';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/server';
import { supabaseConfigured } from '@/lib/env';

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  // When provided, sets the --series-color CSS var so accent buttons and
  // hover states tint to the active series (Master §2.10 detail #6).
  seriesColor?: string;
}

// Transparent shell — the global AuroraBackground lives at z-index -10 and
// must bleed through every section. PageShell deliberately omits any solid
// bg so the aurora is visible everywhere.
export async function PageShell({ children, className, seriesColor }: PageShellProps) {
  // Read the session server-side so the Nav can render the user menu on
  // first paint with no client-side flicker. Short-circuit when Supabase
  // env vars are still placeholders so local dev keeps rendering.
  let userEmail: string | null = null;
  if (supabaseConfigured) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userEmail = user?.email ?? null;
    } catch {
      // Auth read shouldn't ever take down the shell.
      userEmail = null;
    }
  }

  return (
    <div
      className={cn('flex min-h-screen flex-col', className)}
      style={seriesColor ? ({ '--series-color': seriesColor } as React.CSSProperties) : undefined}
    >
      <Nav userEmail={userEmail} />
      <main className="flex-1">{children}</main>
      <AuthorityFooter />
      <Footer />
    </div>
  );
}
