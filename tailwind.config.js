// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],

//   theme: {
//     extend: {

//       /* 🎨 BLUE-FIRST DESIGN SYSTEM */
//       colors: {
//         /* 🔵 PRIMARY (TRUST) */
//         primary: "#2563EB",        // main blue
//         primaryHover: "#1D4ED8",   // hover
//         primaryLight: "#EFF6FF",   // subtle bg

//         /* ⚪ NEUTRALS (IMPORTANT) */
//         bgSoft: "#F8FAFC",         // app background
//         card: "#FFFFFF",

//         textMain: "#0F172A",
//         textSub: "#64748B",

//         borderLight: "#E2E8F0",

//         /* ✅ STATUS COLORS (keep minimal) */
//         success: "#16A34A",
//         warning: "#F59E0B",
//         danger: "#DC2626",
//       },

//       /* 🌈 CONTROLLED GRADIENT (ONLY FOR ACCENTS) */
//       backgroundImage: {
//         "brand-gradient":
//           "linear-gradient(to right, #2563EB, #3B82F6)",

//         "soft-bg":
//           "linear-gradient(to bottom right, #F8FAFC, #FFFFFF)",
//       },

//       /* ✨ SHADOW SYSTEM (SOFT, NOT GLOWY) */
//       boxShadow: {
//         soft: "0 2px 8px rgba(15, 23, 42, 0.04)",
//         medium: "0 6px 20px rgba(15, 23, 42, 0.08)",
//       },

//       /* ⚡ CLEAN MICRO ANIMATIONS */
//       keyframes: {
//         fadeIn: {
//           "0%": { opacity: 0, transform: "translateY(6px)" },
//           "100%": { opacity: 1, transform: "translateY(0)" },
//         },
//         pop: {
//           "0%": { transform: "scale(0.98)" },
//           "100%": { transform: "scale(1)" },
//         },
//       },

//       animation: {
//         fadeIn: "fadeIn 0.35s ease-out",
//         pop: "pop 0.15s ease-out",
//       },

//       /* 🔤 TYPOGRAPHY POLISH (IMPORTANT) */
//       fontSize: {
//         base: ["14px", "20px"],
//         lg: ["16px", "24px"],
//         xl: ["18px", "28px"],
//       },

//       borderRadius: {
//         xl: "12px",
//         "2xl": "16px",
//       },

//     },
//   },

//   plugins: [],
// };

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // High-end Dark Theme
        brandDark: "#1E293B", 
        brandBlue: "#2563EB",
        
        // Semantic Palette
        primary: "#2563EB",
        secondary: "#64748B",
        accent: "#3B82F6",
        bgSoft: "#F8FAFC",
        
        // Status
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2.5rem', // For Cards
        '4xl': '3.5rem', // For the Hero Section
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'blue': '0 20px 25px -5px rgba(37, 99, 235, 0.1), 0 10px 10px -5px rgba(37, 99, 235, 0.04)',
      },
      letterSpacing: {
        tightest: '-.075em',
        widest: '.25em', // For those uppercase headers
      }
    },
  },
  plugins: [],
};