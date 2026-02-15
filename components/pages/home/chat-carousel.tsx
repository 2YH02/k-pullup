"use client";

import HorizontalScroll from "@/components/common/horizontal-scroll";
import cn from "@lib/cn";
import { useRouter } from "next/navigation";

const chatRoomData = [
  { location: "서울", icon: "🏙️", message: "서울 핫플 어디야?🔥", code: "so" },
  {
    location: "경기",
    icon: "🏡",
    message: "근교 드라이브 갈 사람? 🚗",
    code: "gg",
  },
  {
    location: "인천",
    icon: "🌊",
    message: "월미도 회 먹으러 갈까?🐟",
    code: "ic",
  },
  {
    location: "부산",
    icon: "🌅",
    message: "광안리 야경 보러 갈래?✨",
    code: "bs",
  },
  {
    location: "대전",
    icon: "🚆",
    message: "성심당 빵 먹으러 가자!🥐",
    code: "dj",
  },
  {
    location: "제주도",
    icon: "🏝️",
    message: "오늘 제주 날씨 어때?☀️",
    code: "jj",
  },
  {
    location: "충남",
    icon: "⛵",
    message: "대천해수욕장 가본 사람?🏖️",
    code: "cn",
  },
  {
    location: "충북",
    icon: "🍇",
    message: "와인 마시러 충북 가볼까?🍷",
    code: "cb",
  },
  {
    location: "전남",
    icon: "🍜",
    message: "순천에서 먹을 거 추천!🤤",
    code: "jn",
  },
  {
    location: "전북",
    icon: "🏯",
    message: "전주 한옥마을 가고 싶다!🏡",
    code: "jb",
  },
  { location: "경남", icon: "🌉", message: "창원 가볼 만한 곳?🎡", code: "gn" },
  { location: "경북", icon: "⛰️", message: "경주 불국사 어떰?🕌", code: "gb" },
  {
    location: "대구",
    icon: "🔥",
    message: "대구 요즘 날씨 어때요? 🌤️",
    code: "dg",
  },
  {
    location: "강원",
    icon: "⛷️",
    message: "강릉에서 커피 한 잔?☕",
    code: "gw",
  },
  { location: "울산", icon: "🐋", message: "고래 보고 싶다!🐳", code: "us" },
];

const ChatCarousel = () => {
  const router = useRouter();

  const handleClick = (code: string) => {
    router.push(`/social/chat/${code}`);
  };

  const cardClassName = cn(
    "group shrink-0 w-58 h-22 rounded-2xl border border-primary/12 bg-side-main",
    "px-3 py-2.5 text-left transition-all duration-200",
    "web:hover:border-primary/30 web:hover:bg-white/55",
    "active:scale-[0.99] active:bg-white/65",
    "dark:web:hover:bg-black/35 dark:active:bg-black/45"
  );

  return (
    <HorizontalScroll className="gap-3 py-1 px-1">
      <a
        href="https://open.kakao.com/o/gyOTXHUg"
        target="_blank"
        rel="noreferrer"
        className={cn(cardClassName, "flex items-center gap-3")}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg">
          💬
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-text-on-surface dark:text-white">
            오픈 채팅
          </div>
          <div className="mt-0.5 truncate text-xs text-text-on-surface-muted dark:text-grey-light">
            카카오톡 오픈 채팅에 참여해보세요
          </div>
        </div>
      </a>
      {chatRoomData.map((v) => {
        return (
          <button
            key={v.location}
            onClick={() => handleClick(v.code)}
            className={cn(cardClassName, "flex items-center gap-3")}
            type="button"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg">
              {v.icon}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-text-on-surface dark:text-white">
                {v.location} 채팅방
              </div>
              <div className="mt-0.5 truncate text-xs text-text-on-surface-muted dark:text-grey-light">
                {v.message}
              </div>
            </div>
          </button>
        );
      })}
    </HorizontalScroll>
  );
};

export default ChatCarousel;
