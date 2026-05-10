export default function Card({ children, className = "", onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-white 
        border border-slate-100
        rounded-[2.5rem] 
        p-8
        transition-all duration-500 ease-out
        ${onClick ? "cursor-pointer hover:border-blue-600 hover:shadow-2xl hover:-translate-y-2 active:scale-[0.98]" : "shadow-sm"}
        ${className}
      `}
    >
      {/* Subtle background glow for cards on hover */}
      {onClick && (
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

