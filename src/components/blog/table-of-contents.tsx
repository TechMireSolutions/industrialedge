"use client";

import { useEffect, useState } from "react";
import { ListOrdered } from "lucide-react";

interface TocItem {
  id: string;
  title: string;
  level: number;
}

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || "");

  useEffect(() => {
    if (!items.length) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;

      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        const element = document.getElementById(item.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveId(item.id);
          return;
        }
      }

      setActiveId(items[0].id);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveId(id);
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3.5 flex items-center gap-2">
        <ListOrdered className="w-4 h-4 text-[#0ea57a]" />
        Table of Contents
      </h4>
      <nav className="space-y-1">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.id)}
              className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-all flex items-start gap-2 ${
                isActive
                  ? "bg-[#0ea57a]/10 text-[#0ea57a] font-semibold border-l-2 border-[#0ea57a]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-normal"
              } ${item.level === 3 ? "pl-5" : ""}`}
            >
              <span className="line-clamp-1">{item.title}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
