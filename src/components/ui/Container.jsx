// export default function Container({ children }) {
//   return (
//     <div className="max-w-5xl mx-auto px-4 py-6">
//       <div className="bg-white rounded-2xl p-6 shadow-sm">
//         {children}
//       </div>
//     </div>
//   );
// }


export default function Container({ children }) {
  return (
    // Changed w-[90%] to w-[95%] and removed max-w entirely for a true 90%+ feel
    // or set a very high max-width for ultra-wide monitors
    <div className="w-[95%] 2xl:w-[92%] mx-auto py-6 md:py-10">
      {/* Reduced the inner padding so the content (like your hero) fills more of the card */}
      <div className="bg-white rounded-[2.5rem] p-4 md:p-8 shadow-sm border border-slate-100 min-h-[85vh] overflow-hidden">
        {children}
      </div>
    </div>
  );
}