export default function PageWrapper({ children }) {
  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 pt-24 sm:pt-24">
      {children}
    </div>
  );
}