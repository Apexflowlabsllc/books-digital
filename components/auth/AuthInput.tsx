'use client';

import { forwardRef, useId, type InputHTMLAttributes } from 'react';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  function AuthInput({ label, hint, id, className, ...rest }, ref) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    return (
      <label htmlFor={inputId} className="mb-5 block">
        <span className="eyebrow mb-2 block">{label}</span>
        <input
          {...rest}
          id={inputId}
          ref={ref}
          className={
            'w-full border border-line bg-bg px-3 py-3 text-sm text-ink placeholder:text-ink-mute focus:border-accent focus:outline-none ' +
            (className ?? '')
          }
        />
        {hint ? <span className="mt-1.5 block text-[12px] text-ink-mute">{hint}</span> : null}
      </label>
    );
  },
);
