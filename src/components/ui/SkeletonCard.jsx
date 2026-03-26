export default function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse">

      <div className="flex gap-4">
        
        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>

        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/5"></div>
        </div>

      </div>

      <div className="mt-4 flex gap-2">
        <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
        <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
      </div>

    </div>
  );
}