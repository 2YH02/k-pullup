"use client";

import minutesAgo from "@/lib/minutes-ago";
import type { Moment } from "@api/moment/get-moment-for-marker";
import Text from "@common/text";
import { decodeBlurhash, pixelsToDataUrl } from "@lib/decode-hash";
import { Plus, XIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";

const getCity = (address: string): string => {
  if (!address) return "";
  const city = address.split(" ")[1];
  return city;
};

const MomentList = ({ data }: { data: Moment[] }) => {
  const router = useRouter();

  const sliderRef = useRef<HTMLDivElement>(null);
  const isDown = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const translateX = useRef<number>(0);

  const [style, setStyle] = useState({ transform: "translateX(0px)" });
  const [viewMoment, setViewMoment] = useState(false);
  const [curMoment, setCurMoment] = useState<Moment | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Mount detection to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Decode blurhash after component mounts (client-side only)
  const imageSrc = useMemo(() => {
    if (!isMounted) {
      return data.map(() => "/placeholder_image.png");
    }

    const width = 100;
    const height = 100;

    return data.map((moment) => {
      try {
        const pixels = decodeBlurhash(moment.blurhash, width, height);
        return pixelsToDataUrl(pixels, width, height);
      } catch {
        return "/placeholder_image.png";
      }
    });
  }, [data, isMounted]);

  let animationFrameId: number;

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    isDown.current = true;
    sliderRef.current.classList.add("active");
    startX.current = e.pageX;
  };

  const handleMouseUp = () => {
    if (!sliderRef.current) return;
    isDown.current = false;
    sliderRef.current.classList.remove("active");
  };

  const handleMouseLeave = () => {
    if (!sliderRef.current) return;
    isDown.current = false;
    sliderRef.current.classList.remove("active");
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDown.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = x - startX.current;
    translateX.current += walk;
    startX.current = x;

    const maxTranslateX = 0;
    const minTranslateX = -(
      sliderRef.current.scrollWidth - sliderRef.current.clientWidth
    );
    translateX.current = Math.max(
      Math.min(translateX.current, maxTranslateX),
      minTranslateX
    );

    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    animationFrameId = requestAnimationFrame(() => {
      setStyle({ transform: `translateX(${translateX.current}px)` });
    });
  };

  const handleViewMoment = (moment: Moment) => {
    setViewMoment(true);
    setCurMoment(moment);
  };

  const nextMoment = () => {
    if (!curMoment) return;
    let i = data.findIndex((moment) => curMoment.storyID === moment.storyID);
    if (i === data.length - 1) setCurMoment(data[0]);
    else setCurMoment(data[i + 1]);
  };
  const prevMoment = () => {
    if (!curMoment) return;
    let i = data.findIndex((moment) => curMoment.storyID === moment.storyID);
    if (i === 0) setCurMoment(data[data.length - 1]);
    else setCurMoment(data[i - 1]);
  };

  const handleClickNext = (e: MouseEvent) => {
    const divElement = e.currentTarget;
    const clickX = e.nativeEvent.offsetX;
    const divWidth = divElement.clientWidth;

    if (clickX < divWidth / 2) {
      prevMoment();
    } else {
      nextMoment();
    }
  };

  if (viewMoment && curMoment) {
    const { hours, minutes } = minutesAgo(curMoment.createdAt);

    return (
      <div className="absolute mo:fixed top-0 left-0 z-50 flex h-full w-full flex-col bg-black/95 web:rounded-lg">
        {data.length > 1 && (
          <div className="flex gap-1 px-2 pt-2">
            {data.map((moment) => {
              if (curMoment.storyID === moment.storyID) {
                return (
                  <span
                    key={moment.storyID}
                    className="h-0.5 grow rounded-lg bg-white/85"
                  />
                );
              } else {
                return (
                  <span
                    key={moment.storyID}
                    className="h-0.5 grow rounded-lg bg-white/25"
                  />
                );
              }
            })}
          </div>
        )}

        <div className="shrink-0 flex h-11 items-center justify-between px-3">
          <div className="truncate">
            <span className="mr-2 text-sm font-semibold text-white">{curMoment.username}</span>
            <span className="text-xs text-white/65">
              {hours > 0 && `${hours}시간`}{` `}
              {`${minutes}분 전`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setViewMoment(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white transition-colors active:bg-black/60 web:hover:bg-black/55"
            aria-label="모먼트 닫기"
          >
            <XIcon size={16} color="white" />
          </button>
        </div>
        <div className="flex h-full w-full flex-col" onClick={handleClickNext}>
          <div className="flex h-14 flex-col items-center justify-center px-4">
            <div className="line-clamp-1 text-center text-sm text-white/85">
              {curMoment.address}
            </div>
            <button
              className="text-xs text-white/65 underline-offset-2 transition-colors active:text-white web:hover:underline web:hover:text-white/90"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/pullup/${curMoment.markerID}`);
              }}
              type="button"
            >
              위치 자세히보기
            </button>
          </div>
          <div className="relative h-full w-full grow">
            <Image
              src={curMoment.photoURL}
              fill
              alt={curMoment.caption}
              className="object-contain z-10"
              placeholder="blur"
              blurDataURL={
                isMounted
                  ? pixelsToDataUrl(
                      decodeBlurhash(curMoment.blurhash, 100, 200),
                      100,
                      200
                    )
                  : "/placeholder_image.png"
              }
            />
          </div>
          <div className="w-full p-4 text-sm leading-relaxed text-white/95">
            {curMoment.caption}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-2 overflow-hidden">
      <div
        className="flex gap-3"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={style}
      >
        <div className="flex flex-col justify-start">
          <button
            className="group relative h-12 w-12 shrink-0 rounded-full border border-primary/20 bg-side-main transition-all duration-200 active:scale-[0.97] web:hover:border-primary/40 dark:border-grey-dark dark:bg-black/35 dark:web:hover:border-primary-light/35"
            onClick={() => router.push("/moments")}
            type="button"
            aria-label="모먼트 페이지로 이동"
          >
            <div
              className="absolute top-1/2 left-1/2 flex h-10.5 w-10.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary/12 bg-white dark:bg-black"
            >
              <Plus className="text-text-on-surface-muted dark:text-grey-light" size={18} />
            </div>
          </button>
        </div>
        {data.map((moment, i) => (
          <div
            className="flex flex-col justify-center items-center"
            key={`${moment.caption} ${moment.createdAt}`}
          >
            <button
              className="group relative h-12 w-12 shrink-0 rounded-full border border-primary/20 bg-side-main transition-all duration-200 active:scale-[0.97] web:hover:border-primary/40 dark:border-grey-dark dark:bg-black/35 dark:web:hover:border-primary-light/35"
              onClick={() => handleViewMoment(moment)}
              type="button"
              aria-label={`${getCity(moment.address)} 모먼트 보기`}
            >
              <div
                className="absolute top-1/2 left-1/2 h-10.5 w-10.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/90 dark:border-white/12"
                style={{
                  backgroundImage: `url(${imageSrc[i]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </button>
            <Text
              display="block"
              textAlign="center"
              typography="t7"
              className="mt-1 text-text-on-surface-muted dark:text-grey"
            >
              {getCity(moment.address)}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MomentList;
