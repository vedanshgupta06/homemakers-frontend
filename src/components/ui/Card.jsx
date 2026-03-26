export default function Card({ children, className = "", onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        relative
        ${onClick ? "cursor-pointer" : ""}

        bg-white/80 backdrop-blur-md
        border border-gray-200
        rounded-2xl
        p-5

        transition-all duration-300 ease-out

        ${onClick ? "hover:shadow-xl hover:-translate-y-1 active:scale-[0.97]" : ""}

        before:absolute before:inset-0
        before:rounded-2xl
        before:bg-gradient-to-r
        before:from-blue-500/0
        before:via-indigo-500/0
        before:to-purple-500/0
        before:opacity-0
        before:transition duration-300
        before:pointer-events-none

        ${onClick ? `
          hover:before:opacity-100
          hover:before:from-blue-500/10
          hover:via-indigo-500/10
          hover:to-purple-500/10
        ` : ""}

        ${className}
      `}
    >
      {children}
    </div>
  );
}