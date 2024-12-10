"use client";

import type { Moment } from "@api/moment/get-moment-for-marker";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { MouseEvent, useRef, useState } from "react";

const MomentList = ({ data }: { data: Moment[] }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDown = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const translateX = useRef<number>(0);

  const [style, setStyle] = useState({ transform: "translateX(0px)" });
  const [viewMoment, setViewMoment] = useState(false);
  const [curMoment, setCurMoment] = useState<Moment | null>(null);

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
    return (
      <div className="absolute mo:fixed top-0 left-0 flex flex-col w-full h-full bg-black z-50 web:rounded-lg">
        <div className="flex gap-1 p-1">
          {data.map((moment) => {
            if (curMoment.storyID === moment.storyID) {
              return (
                <span
                  key={moment.storyID}
                  className="grow bg-grey-light h-[2px] rounded-lg"
                />
              );
            } else {
              return (
                <span
                  key={moment.storyID}
                  className="grow bg-grey h-[2px] rounded-lg"
                />
              );
            }
          })}
        </div>
        <div className="shrink-0 flex items-center justify-between pl-2 pr-4 h-10">
          <span className="text-white">{curMoment.username}</span>
          <button onClick={() => setViewMoment(false)}>
            <XIcon color="white" />
          </button>
        </div>
        <div className="flex flex-col w-full h-full" onClick={handleClickNext}>
          <div className="grow relative w-full h-full">
            <Image
              src={curMoment.photoURL}
              fill
              alt={curMoment.caption}
              className="object-contain"
            />
          </div>
          <div className="w-full text-white p-4 text-wrap break-words">
            {curMoment.caption}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div
        className="flex gap-3"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={style}
      >
        {data.map((moment) => (
          <button
            key={`${moment.caption} ${moment.createdAt}`}
            className="relative shrink-0 bg-rainbow-gradient rounded-full w-12 h-12 bg-[length:200%_200%] animate-gradient-animate"
            onClick={() => handleViewMoment(moment)}
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full
              border-2 border-solid border-white dark:border-black"
              style={{
                backgroundImage: `url(${moment.photoURL})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MomentList;
