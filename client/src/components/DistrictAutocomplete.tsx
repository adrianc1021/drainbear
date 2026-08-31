import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, MapPin, Search, X } from "lucide-react";
import { MAP_DISTRICTS, type MapDistrict } from "@/lib/hkDistrictPaths";

const REGION_LABELS: Record<MapDistrict["region"], string> = {
  hki: "港島",
  kln: "九龍",
  nt: "新界及離島",
};

interface DistrictAutocompleteProps {
  value: MapDistrict | null;
  onChange: (district: MapDistrict | null) => void;
  label?: string;
}

export default function DistrictAutocomplete({
  value,
  onChange,
  label = "服務地區（可稍後補充）",
}: DistrictAutocompleteProps) {
  const inputId = useId();
  const listboxId = `${inputId}-listbox`;
  const statusId = `${inputId}-status`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(value?.name ?? "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized || value?.name === query) return MAP_DISTRICTS;

    return MAP_DISTRICTS.filter(
      district =>
        district.name.includes(normalized) ||
        district.nameEn.toLowerCase().includes(normalized)
    );
  }, [query, value]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const selectDistrict = (district: MapDistrict) => {
    onChange(district);
    setQuery(district.name);
    setOpen(false);
    setActiveIndex(-1);
  };

  const clear = () => {
    onChange(null);
    setQuery("");
    setOpen(true);
    setActiveIndex(-1);
  };

  return (
    <div ref={rootRef} className="relative mt-5">
      <label htmlFor={inputId} className="block text-sm font-bold text-navy">
        {label}
      </label>
      <div className="relative mt-2">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id={inputId}
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-describedby={statusId}
          aria-activedescendant={
            activeIndex >= 0 ? `${inputId}-option-${activeIndex}` : undefined
          }
          value={query}
          placeholder="輸入香港 18 區，如：觀塘區"
          autoComplete="off"
          onFocus={() => setOpen(true)}
          onChange={event => {
            setQuery(event.target.value);
            onChange(null);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onKeyDown={event => {
            if (event.key === "Escape") {
              setOpen(false);
              setActiveIndex(-1);
              return;
            }

            if (matches.length === 0) return;

            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
              setActiveIndex(index => (index + 1) % matches.length);
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setOpen(true);
              setActiveIndex(index =>
                index <= 0 ? matches.length - 1 : index - 1
              );
            } else if (event.key === "Enter" && open) {
              event.preventDefault();
              selectDistrict(matches[activeIndex >= 0 ? activeIndex : 0]);
            }
          }}
          className="min-h-12 w-full rounded-lg border border-navy/25 bg-white py-3 pl-10 pr-11 text-base text-navy outline-none focus:border-navy focus:ring-2 focus:ring-safety/50"
        />
        {query ? (
          <button
            type="button"
            aria-label="清除服務地區"
            onClick={clear}
            className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-mist hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <span id={statusId} className="sr-only" aria-live="polite">
        {matches.length > 0
          ? `找到 ${matches.length} 個地區`
          : `未找到 ${query} 的地區結果`}
      </span>

      {open ? (
        <div
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-2 max-h-[min(20rem,45dvh)] overflow-y-auto overscroll-contain rounded-lg border border-border bg-white shadow-xl"
        >
          {matches.length > 0 ? (
            matches.map((district, index) => (
              <button
                key={district.id}
                id={`${inputId}-option-${index}`}
                type="button"
                role="option"
                aria-selected={value?.id === district.id}
                tabIndex={-1}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectDistrict(district)}
                className={`flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left ${
                  activeIndex === index ? "bg-mist" : "hover:bg-mist"
                }`}
              >
                <MapPin className="h-4 w-4 shrink-0 text-wagreen-dark" />
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-navy">
                    {district.name}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {REGION_LABELS[district.region]} · {district.nameEn}
                  </span>
                </span>
                {value?.id === district.id ? (
                  <Check className="h-4 w-4 shrink-0 text-wagreen-dark" />
                ) : null}
              </button>
            ))
          ) : (
            <p className="px-4 py-4 text-sm text-muted-foreground">
              未找到相符的香港行政區，可稍後在 WhatsApp 補充詳細地址。
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
