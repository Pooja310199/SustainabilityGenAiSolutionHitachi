export default function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-3">
        {/* Spinner */}
        <div
          className="w-12 h-12 border-4 border-gray-300 
                        border-t-blue-600 rounded-full animate-spin"
        />

        <p className="text-sm text-gray-700 font-medium">
          Fetching Risk Report...
        </p>
      </div>
    </div>
  );
}
