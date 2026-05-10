export default function SkeletonCard() {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 animate-pulse">
      <div className="flex gap-6">
        <div className="w-16 h-16 bg-slate-200 rounded-2xl"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-slate-200 rounded-full w-1/2"></div>
          <div className="h-3 bg-slate-200 rounded-full w-1/3"></div>
        </div>
      </div>
      <div className="mt-8 flex gap-3">
        <div className="h-10 w-28 bg-slate-200 rounded-xl"></div>
        <div className="h-10 w-28 bg-slate-200 rounded-xl"></div>
      </div>
    </div>
  );
}