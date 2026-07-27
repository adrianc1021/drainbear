/**
 * 通渠熊 DrainBear — 麵包屑導航（視覺 + 無障礙）
 * 與 SEO 元件的 breadcrumbs prop 搭配使用（JSON-LD 由 SEO 元件輸出）
 */
import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";

export interface Crumb {
  name: string;
  path: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="麵包屑導航" className="container pt-5 md:pt-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground md:text-sm">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-navy/25" strokeWidth={2} />}
              {last ? (
                <span aria-current="page" className="font-semibold text-navy">
                  {c.name}
                </span>
              ) : (
                <Link
                  href={c.path}
                  className="btn-smooth inline-flex items-center gap-1 hover:text-wagreen-dark"
                >
                  {i === 0 && <Home className="h-3.5 w-3.5" strokeWidth={2} />}
                  {c.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

