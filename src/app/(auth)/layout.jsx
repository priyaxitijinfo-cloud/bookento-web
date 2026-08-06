export default function AuthLayout({ children }) {
  return (
    <div className="bg-background flex min-h-dvh items-center justify-center px-4 py-6 sm:px-6">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
