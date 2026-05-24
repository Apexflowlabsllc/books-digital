interface AuthErrorProps {
  message: string;
}

export function AuthError({ message }: AuthErrorProps) {
  return (
    <p
      role="alert"
      className="mb-4 border px-3 py-2 text-[13px]"
      style={{
        borderColor: 'rgba(239,68,68,0.4)',
        background: 'rgba(239,68,68,0.08)',
        color: '#fca5a5',
      }}
    >
      {message}
    </p>
  );
}
