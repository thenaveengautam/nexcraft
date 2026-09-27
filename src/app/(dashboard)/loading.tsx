import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative">
        <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
        <Loader2 className="w-10 h-10 text-white/80 animate-spin relative z-10" />
      </div>
      <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading...</p>
    </div>
  );
}
