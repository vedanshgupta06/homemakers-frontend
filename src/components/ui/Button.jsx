// export default function Button({
//   children,
//   variant = "primary",
//   className = "",
//   ...props
// }) {
//   const base =
//     "px-5 py-2 rounded-xl font-medium transition-all duration-200";

//   const variants = {
//     primary: "bg-primary text-white hover:opacity-90",
//     secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
//     outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
//   };

//   return (
//     <button
//       className={`${base} ${variants[variant]} ${className}`}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// }
import React from "react";
import { Loader2 } from "lucide-react";

const Button = React.forwardRef(({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className = "",
  leftIcon,
  rightIcon,
  ...props
}, ref) => {
  
  // Base styles: Matching the "Domestic Care" font-black and tracking-widest
  const baseStyles = "inline-flex items-center justify-center font-black uppercase tracking-widest transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.95]";

  const sizes = {
    sm: "px-4 py-2 text-[9px] rounded-xl",
    md: "px-8 py-4 text-[11px] rounded-2xl",
    lg: "px-10 py-6 text-xs rounded-[1.5rem]", // Matches Hero buttons
  };

  const variants = {
    // The "Book Service" style
    primary: "bg-[#2563EB] text-white hover:bg-blue-700 shadow-xl shadow-blue-600/20",
    // The "Mark Attendance" / Dark style
    secondary: "bg-[#1E293B] text-white hover:bg-slate-800 shadow-xl shadow-slate-900/20",
    // Clean white style
    outline: "bg-white border-2 border-slate-100 text-slate-900 hover:border-blue-600 hover:text-blue-600",
    // Dangerous/Alert style
    danger: "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white",
    ghost: "bg-transparent text-slate-400 hover:text-slate-900",
  };

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="mr-3">{leftIcon}</span>}
          <span className="truncate">{children}</span>
          {rightIcon && <span className="ml-3">{rightIcon}</span>}
        </>
      )}
    </button>
  );
});

Button.displayName = "Button";
export default Button;