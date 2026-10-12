import { LayoutGrid } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white">
        <LayoutGrid size={18} />
      </span>
      <span className="text-lg font-semibold tracking-tight">monsun</span>
    </div>
  );
}
