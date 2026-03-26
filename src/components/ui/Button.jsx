export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "px-5 py-2 rounded-xl font-medium transition-all duration-200";

  const variants = {
    primary: "bg-primary text-white hover:opacity-90",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}