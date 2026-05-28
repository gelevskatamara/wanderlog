export default function PageWrapper({ children, className = '' }) {
  return (
    <main className={`p-4 sm:p-6 lg:p-8 ${className}`}>
      {children}
    </main>
  );
}
