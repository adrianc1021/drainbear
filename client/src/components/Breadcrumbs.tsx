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

export default function Breadcrumbs({
  items,
  tone = "dark",
}: {
  items: Crumb[];
  tone?: "default" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <nav
      aria-label="麵包屑導航"
      className={`site-breadcrumbs container relative z-10 pt-5 md:pt-6 ${dark ? "site-breadcrumbs--dark text-white/75" : ""}`}
    >
      <ol className="flex flex-wrap items-center gap-1.5 text-xs md:text-sm">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight
                  className={`h-3.5 w-3.5 ${dark ? "text-white/35" : "text-navy/25"}`}
                  strokeWidth={2}
                />
              )}
              {last ? (
                <span
                  aria-current="page"
                  className={`font-semibold ${dark ? "text-white" : "text-navy"}`}
                >
                  {c.name}
                </span>
              ) : (
                <Link
                  href={c.path}
                  className={`btn-smooth inline-flex min-h-[44px] items-center gap-1 ${
                    dark ? "text-white/75 hover:text-white" : "hover:text-wagreen-dark"
                  }`}
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
