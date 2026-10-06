"use client";

import HorizontalScroll from "@common/horizontal-scroll";
import cn from "@lib/cn";
import { MessageCircle, Users } from "lucide-react";
import { useRouter } from "next/navigation";

const communityRooms = [
  { location: "서울", message: "오늘 어디서 운동해요?", code: "so" },
  { location: "경기", message: "이번 주 철봉 모임 있어요?", code: "gg" },
  { location: "부산", message: "야외 운동 장소 추천", code: "bs" },
  { location: "대전", message: "철봉 상태 어떤가요?", code: "dj" },
  { location: "제주", message: "운동할 곳을 찾습니다", code: "jj" },
];

const cardClassName = cn(
  "group flex h-20 w-56 shrink-0 items-center gap-3 rounded-2xl border px-3.5 py-3 text-left",
  "border-primary/12 bg-search-input-bg/45 transition-[transform,border-color,background-color] duration-180",
  "active:scale-[0.99] active:bg-search-input-bg/75 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40",
  "web:hover:border-primary/30 web:hover:bg-search-input-bg dark:border-white/10 dark:bg-black/35 dark:active:bg-grey-dark/35 dark:web:hover:border-primary-light/30"
);

const CommunityCarousel = () => {
  const router = useRouter();

  return (
    <HorizontalScroll className="gap-2.5 px-0.5 py-1">
      <a
        href="https://open.kakao.com/o/gyOTXHUg"
        target="_blank"
        rel="noreferrer"
        className={cn(cardClassName, "border-primary/25 bg-primary/8 dark:bg-primary-dark/18")}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary dark:bg-primary-light/15 dark:text-primary-light">
          <MessageCircle size={18} />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold text-text-on-surface dark:text-grey-light">
            오픈 채팅
          </span>
          <span className="mt-0.5 block truncate text-[11px] text-text-on-surface-muted dark:text-grey">
            전국 이용자와 이야기해요
          </span>
        </span>
      </a>

      {communityRooms.map((room) => (
        <button
          key={room.code}
          type="button"
          onClick={() => router.push(`/social/chat/${room.code}`)}
          className={cardClassName}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-primary dark:bg-grey-dark/60 dark:text-primary-light">
            <Users size={18} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-text-on-surface dark:text-grey-light">
              {room.location} 채팅
            </span>
            <span className="mt-0.5 block truncate text-[11px] text-text-on-surface-muted dark:text-grey">
              {room.message}
            </span>
          </span>
        </button>
      ))}
    </HorizontalScroll>
  );
};

export default CommunityCarousel;
