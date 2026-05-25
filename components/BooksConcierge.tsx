'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Role = 'user' | 'assistant';
type Msg = { id: string; role: Role; body: string };

// Floating "Books Concierge" chatbot. Posts to our own /api/concierge
// route which calls OpenAI (gpt-4o-mini) with the full Apex library +
// Brian's voice baked into the system prompt. Server-side only —
// OPENAI_API_KEY never reaches the browser. Falls back to voice-correct
// copy if the key is missing or the model errors.
const SUGGESTED = [
  'Where should I start?',
  'I run a small business — which series?',
  'Audiobook or ebook for the discipline series?',
  'How does the Founder Edition work?',
];

const VOICE_FALLBACK = [
  "Backend concierge isn't wired yet — Brian is shipping it. In the meantime:",
  '· If you run anything with payroll: start at /series/the-discipline-blueprint.',
  '· If you want the cheapest entry: /free-chapter/the-discipline-blueprint sends you chapter one.',
  "· If you're a former Spiker customer: /brian-spiker-real-world-proof.",
].join('\n');

export function BooksConcierge() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 'sys-1',
      role: 'assistant',
      body: "Books Concierge. Ask me which book to start with, or what the 12 series cover. I'll point — I won't pitch.",
    },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [unread, setUnread] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [open, messages]);

  function send(text: string) {
    if (!text.trim() || busy) return;
    const userMsg: Msg = { id: `u-${Date.now()}`, role: 'user', body: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setBusy(true);

    (async () => {
      try {
        // Local Next.js API route — calls OpenAI server-side so the
        // key never ships to the browser.
        const res = await fetch('/api/concierge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            history: messages
              .filter((m) => m.role !== 'assistant' || m.id !== 'sys-1')
              .map((m) => ({ role: m.role, content: m.body })),
          }),
        });
        if (!res.ok) throw new Error(`concierge ${res.status}`);
        const data = (await res.json()) as { reply?: string };
        const reply = data.reply || VOICE_FALLBACK;
        const aiMsg: Msg = { id: `a-${Date.now()}`, role: 'assistant', body: reply };
        setMessages((prev) => [...prev, aiMsg]);
        if (!open) setUnread((n) => n + 1);
      } catch {
        setMessages((prev) => [
          ...prev,
          { id: `a-${Date.now()}`, role: 'assistant', body: VOICE_FALLBACK },
        ]);
      } finally {
        setBusy(false);
      }
    })();
  }

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        data-cursor-label={open ? 'Close' : 'Ask Brian'}
        className={cn(
          'fixed bottom-6 right-6 z-[8000] flex h-14 w-14 items-center justify-center rounded-full border border-accent bg-bg-raised shadow-[0_18px_40px_-10px_rgba(217,204,140,0.55)] transition-transform duration-300 hover:scale-105 md:bottom-8 md:right-8',
          open && 'rotate-90',
        )}
        aria-label="Open Books Concierge"
      >
        {open ? (
          <X className="h-6 w-6 text-accent" />
        ) : (
          <MessageSquare className="h-6 w-6 text-accent" />
        )}
        {!open && unread > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-bg">
            {unread}
          </span>
        ) : null}
        {!open ? (
          <span
            aria-hidden
            className="absolute inset-0 -z-10 animate-ping rounded-full border border-accent/60 opacity-50"
          />
        ) : null}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 z-[7900] flex h-[min(70vh,560px)] w-[min(94vw,400px)] flex-col overflow-hidden rounded-[1.5rem] border border-accent/40 bg-bg-raised/95 shadow-[0_30px_80px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl md:bottom-28 md:right-8"
            role="dialog"
            aria-label="Books Concierge chat"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(60% 50% at 50% 0%, rgba(217,204,140,0.18) 0%, transparent 70%)',
              }}
            />
            <header className="relative z-10 flex items-center gap-3 border-b border-line bg-bg-subtle/60 px-5 py-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-accent text-accent">
                <span className="text-base">▲</span>
              </span>
              <div>
                <p className="text-sm font-medium text-ink">Books Concierge</p>
                <p className="text-[10px] uppercase tracking-[0.28em] text-ink-mute">
                  Trained on the 12 series
                </p>
              </div>
            </header>

            <div ref={scrollRef} className="relative z-10 flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {messages.map((m) => (
                <ChatBubble key={m.id} role={m.role} body={m.body} />
              ))}
              {busy ? (
                <ChatBubble role="assistant" body="" typing />
              ) : null}
            </div>

            {messages.length <= 2 ? (
              <div className="relative z-10 flex flex-wrap gap-2 border-t border-line bg-bg-subtle/30 px-5 py-3">
                {SUGGESTED.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-line bg-bg px-3 py-1.5 text-[11px] text-ink-dim transition-colors hover:border-accent hover:text-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="relative z-10 flex items-center gap-2 border-t border-line bg-bg-subtle/60 px-3 py-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the concierge…"
                className="flex-1 bg-transparent px-2 py-2 text-sm text-ink placeholder:text-ink-mute focus:outline-none"
                aria-label="Message"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-accent text-accent transition-colors hover:bg-accent hover:text-bg disabled:opacity-40"
                aria-label="Send"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function ChatBubble({ role, body, typing }: { role: Role; body: string; typing?: boolean }) {
  const isUser = role === 'user';
  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'rounded-br-sm bg-accent text-bg'
            : 'rounded-bl-sm border border-line bg-bg text-ink-dim',
        )}
      >
        {typing ? (
          <span className="inline-flex gap-1" aria-label="Typing">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-mute" style={{ animationDelay: '0ms' }} />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-mute" style={{ animationDelay: '120ms' }} />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-mute" style={{ animationDelay: '240ms' }} />
          </span>
        ) : (
          body
        )}
      </div>
    </div>
  );
}
