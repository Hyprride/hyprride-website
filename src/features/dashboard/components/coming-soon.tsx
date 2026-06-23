import { Construction } from "lucide-react";

/** Placeholder for dashboard pages that are scaffolded but not yet built. */
export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="max-w-md text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand/10 text-brand">
          <Construction className="size-7" />
        </div>
        <h2 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
