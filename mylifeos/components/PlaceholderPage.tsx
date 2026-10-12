import type { LucideIcon } from "lucide-react";
import PageHeader from "./PageHeader";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children?: React.ReactNode;
}

export default function PlaceholderPage({ title, description, icon: Icon, children }: PlaceholderPageProps) {
  return (
    <>
      <PageHeader title={title} />
      <section className="rounded-3xl border border-line bg-white p-8 text-center shadow-card sm:p-14">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
          <Icon size={22} />
        </span>
        <h2 className="mt-4 text-lg font-semibold">Coming soon</h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted">{description}</p>
      </section>
      {children}
    </>
  );
}
