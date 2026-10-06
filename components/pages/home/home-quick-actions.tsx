"use client";

import cn from "@lib/cn";
import { Compass, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuickAction {
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

const actions: QuickAction[] = [
  {
    label: "내 주변 철봉",
    description: "현재 위치에서 찾기",
    href: "/search/around",
    icon: <Compass size={20} strokeWidth={2.1} />,
  },
  {
    label: "철봉 등록하기",
    description: "새 장소 추가하기",
    href: "/register?from=/",
    icon: <Plus size={21} strokeWidth={2.3} />,
  },
];

const HomeQuickActions = () => {
  const router = useRouter();

  return (
    <section className="px-6 pb-6 pt-2 web:px-7" aria-labelledby="home-actions-title">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.08em] text-primary dark:text-primary-light">
            빠른 메뉴
          </p>
          <h1 id="home-actions-title" className="mt-1 max-w-[18rem] text-balance text-lg font-extrabold tracking-tight text-text-on-surface dark:text-grey-light">
            원하는 기능을 골라보세요
          </h1>
        </div>
        <span className="pb-0.5 text-right text-[11px] leading-relaxed text-text-on-surface-muted dark:text-grey">
          주변 찾기부터<br />장소 등록까지
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => router.push(action.href)}
            className={cn(
              "group min-h-18 rounded-2xl border px-3.5 py-3 text-left transition-[transform,border-color,background-color] duration-180",
              "active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40",
              "flex items-center gap-3 border-primary/12 bg-search-input-bg/55 text-text-on-surface web:hover:border-primary/30 web:hover:bg-search-input-bg dark:border-white/10 dark:bg-black/35 dark:text-grey-light dark:web:hover:border-primary-light/30"
            )}
          >
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                "bg-surface text-primary dark:bg-grey-dark/60 dark:text-primary-light"
              )}
            >
              {action.icon}
            </span>
            <span className="min-w-0">
              <span className="block break-keep text-sm font-bold leading-snug">{action.label}</span>
              <span
                className={cn(
                  "mt-0.5 block line-clamp-2 break-keep text-[11px] leading-snug",
                  "text-text-on-surface-muted dark:text-grey"
                )}
              >
                {action.description}
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default HomeQuickActions;
