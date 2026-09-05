'use client';

import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';

// Founder Edition ($9,999) is application-only — NOT Stripe Checkout
// (Master §1.6 + operating rule #8). This form posts to
// /api/v1/founder-edition/apply which enters a review queue.

export function FounderApplicationForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/founder-edition/apply`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          },
        );
        if (!res.ok) throw new Error(`founder-apply ${res.status}`);
        setDone(true);
      } catch (err) {
        setError('Application service is briefly down. Email founder@apexflowlabs.com instead.');
        console.error(err);
      }
    });
  }

  if (done) {
    return (
      <div className="border border-accent bg-bg-subtle p-8">
        <p className="font-display text-3xl text-accent">In review.</p>
        <p className="mt-3 max-w-lg text-ink-dim">
          Brian reviews every application personally. If you fit, expect a calendar invite within
          7 days. If you do not, we say so — no waitlist limbo.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5 border border-line bg-bg-subtle p-6 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Full name" required />
        <Field name="email" label="Email" type="email" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="company" label="Company or operation" />
        <Field name="phone" label="Phone (optional)" type="tel" />
      </div>

      <div>
        <label htmlFor="why" className="eyebrow mb-2 block">
          Why $9,999 makes sense for you
        </label>
        <textarea
          id="why"
          name="why"
          rows={5}
          required
          placeholder="What you operate. What the books unlock. What you would do with a 90-min call with Brian."
          className="w-full border border-line bg-bg px-3 py-3 text-sm text-ink placeholder:text-ink-mute focus:border-accent focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="shipping" className="eyebrow mb-2 block">
          Shipping address for the 636-book set
        </label>
        <textarea
          id="shipping"
          name="shipping"
          rows={3}
          required
          className="w-full border border-line bg-bg px-3 py-3 text-sm text-ink focus:border-accent focus:outline-none"
        />
      </div>

      <button type="submit" disabled={isPending} className="cta-primary">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
        {isPending ? 'Submitting' : 'Submit application'}
      </button>

      {error ? (
        <p role="alert" className="text-xs text-accent-hot">
          {error}
        </p>
      ) : (
        <p className="text-xs text-ink-mute">
          Application only. 100 spots ever. Brian reads every one.
        </p>
      )}
    </form>
  );
}

function Field({
  name,
  label,
  type = 'text',
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="eyebrow mb-2 block">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full border border-line bg-bg px-3 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
      />
    </div>
  );
}
