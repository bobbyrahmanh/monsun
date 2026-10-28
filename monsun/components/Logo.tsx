import { LayoutGrid } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-on-ink">
        <LayoutGrid size={18} />
      </span>
      <span className="text-lg font-semibold tracking-tight">monsun</span>
    </div>
  );
}
