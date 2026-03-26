export default function Container({ children }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        {children}
      </div>
    </div>
  );
}