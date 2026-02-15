"use client";

import Text from "@common/text";
import { motion, useReducedMotion } from "framer-motion";
import {
  Bookmark as BookmarkLine,
  ChevronRight,
  FileText,
  Inbox,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

const iconClass = "text-primary/85 dark:text-primary-light";

const LinkList = ({ isAdmin }: { isAdmin?: boolean }) => {
  return (
    <div className="px-4 pb-2">
      <div className="space-y-2 rounded-xl border border-primary/10 bg-surface/70 p-2 dark:border-grey-dark dark:bg-black">
        <LinkButton url="/mypage/bookmark" icon={<BookmarkLine size={18} strokeWidth={2.1} className={iconClass} />}>
          즐겨찾기
        </LinkButton>

        <LinkButton url="/mypage/locate" icon={<MapPin size={18} strokeWidth={2.1} className={iconClass} />}>
          등록한 장소
        </LinkButton>

        <LinkButton url="/mypage/report" icon={<FileText size={18} strokeWidth={2.1} className={iconClass} />}>
          내 정보 수정 제안
        </LinkButton>

        <LinkButton url="/mypage/myreport" icon={<Inbox size={18} strokeWidth={2.1} className={iconClass} />}>
          받은 정보 수정 제안
        </LinkButton>

        {isAdmin && (
          <LinkButton
            target="_blank"
            url="/admin"
            icon={<ShieldCheck size={18} strokeWidth={2.1} className={iconClass} />}
          >
            수정 요청 관리 (어드민)
          </LinkButton>
        )}
      </div>
    </div>
  );
};

const LinkButton = ({
  url,
  icon,
  target,
  children,
}: React.PropsWithChildren<{
  url: string;
  icon: React.ReactNode;
  target?: string;
}>) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Link
      href={url}
      target={target}
      className="group flex items-center gap-3 rounded-lg border border-primary/10 bg-white/55 px-3 py-2.5 transition-[transform,background-color,border-color] duration-180 ease-out web:hover:border-primary/20 web:hover:bg-white/70 active:scale-[0.99] motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 dark:border-grey-dark dark:bg-black-light dark:web:hover:border-grey dark:web:hover:bg-black"
    >
      <motion.span
        className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/8 dark:bg-primary-dark/20"
        whileHover={prefersReducedMotion ? undefined : { y: -1, scale: 1.03 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
      >
        {icon}
      </motion.span>
      <Text typography="t6" className="font-semibold text-primary dark:text-primary-light">
        {children}
      </Text>
      <span className="ml-auto text-grey-dark transition-transform duration-180 ease-out group-hover:translate-x-px motion-reduce:transform-none dark:text-grey">
        <ChevronRight size={16} strokeWidth={2.2} />
      </span>
    </Link>
  );
};

export const Received = ({ size = 40 }: { size?: number }) => {
  return (
    <svg
      data-name="Layer 1"
      id="Layer_1"
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
    >
      <circle className="fill-[#88a451]" cx="217.44" cy="282.56" r="206.7" />
      <path
        className="fill-[#cececd]"
        d="M363.6,136.4a209,209,0,0,1,20.53,23.88l18.52-18.52a31.39,31.39,0,0,0,0-44.41h0a31.39,31.39,0,0,0-44.41,0l-18.52,18.52A209,209,0,0,1,363.6,136.4Z"
      />
      <path
        className="opacity-15"
        d="M402.65,97.35h0a31,31,0,0,0-11.44-7.21,31.19,31.19,0,0,1-9,24.38L363.7,133l-2,1.53c.62.61,1.25,1.21,1.86,1.83a209,209,0,0,1,20.53,23.88l18.52-18.52A31.39,31.39,0,0,0,402.65,97.35Z"
      />
      <path
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        d="M406,137.73A64.85,64.85,0,1,0,362.28,94"
      />
      <circle className="fill-[#f8e6c5]" cx="217.44" cy="282.56" r="153.43" />
      <path
        className="opacity-15"
        d="M363.6,136.4a205.8,205.8,0,0,0-66.89-44.76C362.23,172.81,357.3,292,281.87,367.43c-60.94,60.95-150.47,75.84-225.43,44.76a208.86,208.86,0,0,0,14.84,16.53c80.72,80.73,211.6,80.73,292.32,0S444.32,217.12,363.6,136.4Z"
      />
      <polygon
        className="fill-white"
        points="217.44 193.66 177.29 282.56 217.44 282.56 257.59 282.56 217.44 193.66"
      />
      <polygon
        className="fill-[#ee3734]"
        points="217.44 371.46 177.29 282.56 217.44 282.56 257.59 282.56 217.44 371.46"
      />
      <line
        className="fill-none stroke-[#2f2f31] stroke-linecap-round stroke-linejoin-round stroke-[20.43px]"
        x1="325.93"
        x2="303"
        y1="174.07"
        y2="197"
      />
      <line
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="325.93"
        x2="303"
        y1="174.07"
        y2="197"
      />
      <line
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="108.94"
        x2="131.88"
        y1="391.06"
        y2="368.12"
      />
      <line
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="325.93"
        x2="303"
        y1="391.06"
        y2="368.12"
      />
      <line
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="108.94"
        x2="131.88"
        y1="174.07"
        y2="197"
      />
      <line
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="217.44"
        x2="217.44"
        y1="436"
        y2="403.56"
      />
      <line
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="217.44"
        x2="217.44"
        y1="129.13"
        y2="161.56"
      />
      <line
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="64"
        x2="96.44"
        y1="282.56"
        y2="282.56"
      />
      <line
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="370.87"
        x2="338.44"
        y1="282.56"
        y2="282.56"
      />
      <circle
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        cx="217.44"
        cy="282.56"
        r="206.7"
      />
      <path
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        d="M363.6,136.4a209,209,0,0,1,20.53,23.88l18.52-18.52a31.39,31.39,0,0,0,0-44.41h0a31.39,31.39,0,0,0-44.41,0l-18.52,18.52A209,209,0,0,1,363.6,136.4Z"
      />
      <circle
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        cx="217.44"
        cy="282.56"
        r="153.43"
      />
      <polygon
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        points="217.44 193.66 177.29 282.56 217.44 282.56 257.59 282.56 217.44 193.66"
      />
      <polygon
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        points="217.44 371.46 177.29 282.56 217.44 282.56 257.59 282.56 217.44 371.46"
      />
    </svg>
  );
};

export const Proposal = ({ size = 40 }: { size?: number }) => {
  return (
    <svg
      data-name="Layer 1"
      id="Layer_1"
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
    >
      <polygon
        className="fill-[#f8e6c5]"
        points="369.64 48.91 489.27 80.71 489.27 451.09 369.64 419.29 369.64 48.91"
      />
      <polygon
        className="fill-[#f8e6c5]"
        points="130.36 48.91 250 80.71 250 451.09 130.36 419.29 130.36 48.91"
      />
      <polygon
        className="opacity-20"
        points="369.64 48.91 489.27 80.71 489.27 451.09 369.64 419.29 369.64 48.91"
      />
      <polygon
        className="opacity-20"
        points="130.36 48.91 250 80.71 250 451.09 130.36 419.29 130.36 48.91"
      />
      <polygon
        className="fill-[#f8e6c5]"
        points="369.64 48.91 250 80.71 250 451.09 369.64 419.29 369.64 48.91"
      />
      <polygon
        className="fill-[#f8e6c5]"
        points="130.36 48.91 10.73 80.71 10.73 451.09 130.36 419.29 130.36 48.91"
      />
      <line
        className="fill-white stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="82.67"
        x2="48.1"
        y1="138.55"
        y2="173.12"
      />
      <line
        className="fill-white stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="82.67"
        x2="48.1"
        y1="173.12"
        y2="138.55"
      />
      <line
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="63.75"
        x2="74.07"
        y1="157.55"
        y2="157.55"
      />
      <path
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px] stroke-dasharray-[20.82_34.69]"
        d="M108.76,157.55H285.45a45,45,0,0,1,45,45h0a45,45,0,0,1-45,45H219.12a41.86,41.86,0,0,0-41.85,41.86h0a41.85,41.85,0,0,0,41.85,41.85H407.59"
      />
      <line
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="424.94"
        x2="435.26"
        y1="331.27"
        y2="331.27"
      />
      <line
        className="fill-white stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="445.66"
        x2="411.1"
        y1="313.98"
        y2="348.55"
      />
      <line
        className="fill-white stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="445.66"
        x2="411.1"
        y1="348.55"
        y2="313.98"
      />
      <polygon
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        points="369.64 48.91 489.27 80.71 489.27 451.09 369.64 419.29 369.64 48.91"
      />
      <polygon
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        points="369.64 48.91 250 80.71 250 451.09 369.64 419.29 369.64 48.91"
      />
      <polygon
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        points="130.36 48.91 10.73 80.71 10.73 451.09 130.36 419.29 130.36 48.91"
      />
      <polygon
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        points="130.36 48.91 250 80.71 250 451.09 130.36 419.29 130.36 48.91"
      />
    </svg>
  );
};

export default LinkList;
