"use client";

import { type Device } from "@/app/mypage/page";
import { type Marker } from "@/types/marker.types";
import { type FacilitiesRes } from "@api/marker/get-facilities";
import Ads from "@common/ads";
import Badge from "@common/badge";
import Divider from "@common/divider";
import ListItem, { ListContents, ListRight } from "@common/list-item";
import Section, { SectionTitle } from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import { useToast } from "@hooks/useToast";
import deleteComment from "@lib/api/comment/delete-comment";
import { formatDate } from "@lib/format-date";
import AddressButton from "@pages/pullup/address-button";
import ButtonList from "@pages/pullup/button-list";
import Comments from "@pages/pullup/comments";
import Description from "@pages/pullup/description";
import ImageCarousel from "@pages/pullup/image-carousel";
import ImageList from "@pages/pullup/image-list";
import MoveMap from "@pages/pullup/move-map";
import WeatherBadge from "@pages/pullup/weather-badge";
import { useBottomSheetStore } from "@store/useBottomSheetStore";
import { useProviderStore } from "@store/useProviderStore";
import useUserStore from "@store/useUserStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { BsHouseDoor, BsX } from "react-icons/bs";

interface PullupClientProps {
  facilities: FacilitiesRes[];
  marker: Marker;
  deviceType: Device;
  referrer: string | null;
}

const PullupClient = ({
  facilities,
  marker,
  deviceType,
  referrer,
}: PullupClientProps) => {
  const router = useRouter();
  const { show } = useBottomSheetStore();
  const { providerInfo, setProviderInfo } = useProviderStore();
  const { user } = useUserStore();
  const { toast } = useToast();

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleDelete = async (commentId: number) => {
    setDeleteLoading(true);
    const response = await deleteComment(commentId);

    if (!response.ok) {
      toast({ description: "잠시 후 다시 시도해주세요" });
      setDeleteLoading(false);
      return;
    }

    const newComment = providerInfo.filter(
      (comment) => comment.commentId !== commentId
    );
    setProviderInfo([...newComment]);
    setDeleteLoading(false);
  };

  const onScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const buffer = 5;

      if (
        scrollHeight <= clientHeight + buffer ||
        scrollTop + clientHeight >= scrollHeight - buffer
      ) {
        if (activeIndex !== sectionRefs.current.length - 1) {
          setActiveIndex(sectionRefs.current.length - 1);
        }
        return;
      }

      const scrollPos = scrollTop + 44;

      const tops = sectionRefs.current.map((section) => section!.offsetTop);
      const nextIndex = tops.findIndex((top) => top > scrollPos);
      const newIndex =
        nextIndex === -1
          ? sectionRefs.current.length - 1
          : nextIndex === 0
          ? 0
          : nextIndex - 1;

      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    },
    [activeIndex]
  );

  const 철봉 = facilities.find((item) => item.facilityId === 1);
  const 평행봉 = facilities.find((item) => item.facilityId === 2);

  return (
    <SideMain
      headerTitle={marker.address}
      hasBackButton
      referrer={!!referrer}
      deviceType={deviceType}
      headerIcon={
        <BsHouseDoor size={20} className="text-black dark:text-grey-light" />
      }
      headerIconClick={() => {
        router.push("/");
      }}
      onScroll={(e) => onScroll(e)}
    >
      <MoveMap
        lat={marker.latitude}
        lng={marker.longitude}
        markerId={marker.markerId}
      />

      <ImageCarousel photos={marker.photos} />

      <Section className="py-0">
        <div className="flex items-center mt-2 flex-wrap">
          {!철봉 ||
            !평행봉 ||
            (철봉.quantity <= 0 && 평행봉.quantity <= 0 && (
              <Badge
                text={`기구 개수 정보 없음`}
                className="flex items-center justify-center mr-2 mb-2 h-7 border-none shadow-full dark:shadow-[rgba(255,255,255,0.1)]"
                textStyle="leading-3"
              />
            ))}
          {철봉 && 철봉.quantity > 0 && (
            <Badge
              text={`철봉 ${철봉?.quantity}개`}
              className="flex items-center justify-center mr-2 mb-2 h-7 border-none shadow-full dark:shadow-[rgba(255,255,255,0.1)]"
              textStyle="leading-3"
            />
          )}
          {평행봉 && 평행봉.quantity > 0 && (
            <Badge
              text={`평행봉 ${평행봉?.quantity}개`}
              className="flex items-center justify-center mr-2 mb-2 h-7 border-none shadow-full dark:shadow-[rgba(255,255,255,0.1)]"
              textStyle="leading-3"
            />
          )}
          <WeatherBadge lat={marker.latitude} lng={marker.longitude} />
        </div>

        <AddressButton
          address={marker.address || "정보가 제공되지 않는 주소입니다."}
          lat={marker.latitude}
          lng={marker.longitude}
        />
        <Description
          description={marker.description}
          markerId={marker.markerId}
          isAdmin={marker.isChulbong || false}
        />
        <Text className="mt-2 text-grey dark:text-[#999]" typography="t7">
          최종 수정일: {formatDate(marker.updatedAt)}
        </Text>
        <div className="flex items-center justify-between">
          <div>
            <Link href={`/pullup/${marker.markerId}/report`} className="mr-2">
              <Text typography="t7" className="underline">
                정보 수정 요청
              </Text>
            </Link>

            {marker.isChulbong && (
              <Link href={`/pullup/${marker.markerId}/facilities`}>
                <Text typography="t7" className="underline">
                  기구 개수 수정
                </Text>
              </Link>
            )}
          </div>

          {marker.username && (
            <div className="flex items-center">
              <span className="mr-1 mb-[3px]">
                <StarIcon />
              </span>
              <Text typography="t7" className="">
                정보 제공자: {marker.username}
              </Text>
            </div>
          )}
        </div>
      </Section>

      <Section className="pb-1">
        <ButtonList marker={marker} />
      </Section>

      <Divider className="h-2" />
      <Ads type="feed" />
      <Divider className="h-2" />

      <div className="sticky top-0 left-0 bg-white dark:bg-black text-black dark:text-grey-light h-11 z-50 flex">
        {["사진", "댓글"].map((label, index) => (
          <button
            key={index}
            onClick={() => {
              sectionRefs.current[index]?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
              setActiveIndex(index);
            }}
            className={`
              grow px-4 py-2 whitespace-nowrap
              border-b-2 transition-colors
              ${
                activeIndex === index
                  ? "border-primary-dark text-black dark:text-grey-light"
                  : "border-gray-200 text-gray-500"
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {providerInfo.length > 0 && (
        <div className="mt-4 px-4">
          {providerInfo.map((comment, index) => {
            if (index < 3) {
              return (
                <ListItem
                  key={comment.commentId}
                  icon={
                    user?.chulbong || user?.userId === comment.userId ? (
                      <BsX size={22} color="#777" />
                    ) : undefined
                  }
                  onIconClick={async () => {
                    if (
                      deleteLoading ||
                      !user ||
                      (!user.chulbong && user.userId !== comment.userId)
                    )
                      return;
                    await handleDelete(comment.commentId);
                  }}
                >
                  <ListContents
                    title={comment.commentText}
                    subTitle={formatDate(comment.postedAt)}
                  />

                  <ListRight>
                    <Text typography="t7">{comment.username}</Text>
                  </ListRight>
                </ListItem>
              );
            }
          })}
        </div>
      )}

      <div
        ref={(el) => {
          sectionRefs.current[0] = el;
        }}
        className="scroll-mt-11"
        id="image-list"
      >
        <Section>
          <SectionTitle
            title="사진"
            buttonTitle="정보 수정 요청"
            onClickButton={() =>
              router.push(`/pullup/${marker.markerId}/report`)
            }
          />
          <ImageList photos={marker.photos} />
        </Section>
      </div>

      <Divider className="h-2" />

      <div
        ref={(el) => {
          sectionRefs.current[1] = el;
        }}
        id="comment-list"
      >
        <Section>
          <SectionTitle
            title="리뷰"
            buttonTitle="리뷰 작성하기"
            onClickButton={() => show("write-comments")}
          />
          <Comments markerId={marker.markerId} />
        </Section>
      </div>
    </SideMain>
  );
};

export default PullupClient;

const StarIcon = () => {
  return (
    <svg
      enableBackground="new 0 0 64 64"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={18}
      height={18}
    >
      <g id="quality">
        <path
          d="M45.4,22.3l5.3-13c0.1-0.3,0.1-0.7-0.1-1l-0.4-0.5h-0.5l-13.5,3.6L25.9,2.3L25.5,2h-0.4c-0.6,0-1.1,0.5-1.1,1l-0.8,14l-11.7,7.3c-0.4,0.2-0.5,0.6-0.5,1l0.1,0.7l13.4,5.4L31,51.2c0.1,0.5,0.6,0.8,1,0.8s0.9-0.3,1-0.7l6.3-17l12.5,1.5l0.1,0c0.4,0,0.8-0.2,0.9-0.6l0.3-0.6L45.4,22.3z"
          className="fill-[#FFD54F]"
        />
        <g>
          <polygon
            points="38,13 35.7,13.7 33,11.3 41.5,32.6 46,33.1"
            className="fill-[#FFECB3]"
          />
          <polygon
            points="28.3,7.1 25.9,5 25.2,18.2 24.3,18.7 34,43 38,32.1 38.3,32.2"
            className="fill-[#FFE082]"
          />
        </g>
        <path
          d="M32.2,49.7l-1.7-5.1l1.1-0.4l0.7,2l1.3-3.6l1.1,0.4L32.2,49.7z M35.4,40.9l-1.1-0.4l3.5-9.4l4.7,0.6l-0.1,1.1l-3.8-0.5L35.4,40.9z M49.7,32.8l-1.2-2l1-0.6l1.2,2L49.7,32.8z M26.2,31.4L25.7,30l-13-5.2l1.5-0.9l0.3,0.4l12.2,4.9l0.6,1.9L26.2,31.4z M16.8,23.6l-0.6-1l7.8-4.9l0.6,1L16.8,23.6z M45.7,18.7l-1.1-0.4l3.5-8.5l1.1,0.4L45.7,18.7z M35.9,13.6l-2.1-1.9l0.8-0.9l1.7,1.5l10.6-2.8l0.3,1.1L35.9,13.6z M26.8,5.6L26.1,5l-0.6,0l0.1-2l2,1.8L26.8,5.6z"
          className="fill-[#FFCA28]"
        />
        <g>
          <rect
            x="21"
            y="50"
            width="22"
            height="5"
            className="fill-[#FF7043]"
          />
          <rect
            x="17"
            y="53"
            width="30"
            height="8"
            className="fill-[#B71C1C]"
          />
          <rect
            x="16"
            y="60"
            width="32"
            height="2"
            className="fill-[#3E2723]"
          />
          <rect
            x="25"
            y="53"
            width="14"
            height="6"
            className="fill-[#FFB300]"
          />
          <rect
            x="26"
            y="54"
            width="12"
            height="4"
            className="fill-[#FBE9E7]"
          />
        </g>
        <g>
          <path
            d="M16.8,49l-4.2-5.7c-1-3.1-1-6.3,0-9.3c0.1-0.3,0.4-0.6,0.8-0.7c0.4-0.1,0.7,0.1,1,0.3C17.8,37.9,18.8,43.8,16.8,49z"
            className="fill-[#FFCA28]"
          />
          <path
            d="M11.4,41.1c-0.4-0.9-0.7-1.6-0.9-2.3c1.7-5.2,0.6-10.9-2.9-15c-0.2-0.2-0.5-0.3-0.7-0.3c-0.5,0-0.8,0.3-1,0.7c-1.6,5.3-0.1,11.1,3.7,15.1l0,0c0.2,0.7,0.5,1.4,0.9,2.3L11.4,41.1z"
            className="fill-[#FFCA28]"
          />
          <path
            d="M14.5,44c-0.8,0-1.5-0.9-1.5-2s0.7-2,1.5-2s1.5,0.9,1.5,2S15.3,44,14.5,44z"
            className="fill-[#FFB300]"
          />
          <path
            d="M7.8,39.4c-0.5,0-1.1-0.3-1.6-0.7c-0.4-0.4-0.6-0.8-0.7-1.2c-0.1-0.5,0-1,0.3-1.3c0.6-0.6,1.7-0.4,2.5,0.4c0.4,0.4,0.6,0.8,0.7,1.2c0.1,0.5,0,1-0.3,1.3C8.5,39.3,8.1,39.4,7.8,39.4z"
            className="fill-[#FFB300]"
          />
          <path
            d="M19,50.4c-0.7-0.5-1.5-1.1-2.3-1.9c-1.7-5.2-6-9.2-11.4-10.3c-0.4-0.1-0.8,0.1-1,0.4c-0.2,0.3-0.2,0.6-0.1,0.9c1.9,5.1,6.5,8.9,11.9,9.8c0.8,0.7,1.6,1.4,2.3,1.9L19,50.4z"
            className="fill-[#FFB300]"
          />
        </g>
        <g>
          <path
            d="M47.2,49l4.2-5.7c1-3.1,1-6.3,0-9.3c-0.1-0.3-0.4-0.6-0.8-0.7c-0.4-0.1-0.7,0.1-1,0.3C46.2,37.9,45.2,43.8,47.2,49z"
            className="fill-[#FFE082]"
          />
          <path
            d="M52.6,41.1c0.4-0.9,0.7-1.6,0.9-2.3c-1.7-5.2-0.6-10.9,2.9-15c0.2-0.2,0.5-0.3,0.7-0.3c0.5,0,0.8,0.3,1,0.7c1.6,5.3,0.1,11.1-3.7,15.1l0,0c-0.2,0.7-0.5,1.4-0.9,2.3L52.6,41.1z"
            className="fill-[#FFD54F]"
          />
          <path
            d="M48,42c0-1.1,0.7-2,1.5-2s1.5,0.9,1.5,2s-0.7,2-1.5,2S48,43.1,48,42z"
            className="fill-[#FFB300]"
          />
          <path
            d="M55.3,39c-0.3-0.3-0.4-0.8-0.3-1.3c0.1-0.4,0.3-0.9,0.7-1.2c0.8-0.8,1.9-0.9,2.5-0.4c0.3,0.3,0.4,0.8,0.3,1.3c-0.1,0.4-0.3,0.9-0.7,1.2c-0.5,0.5-1,0.7-1.6,0.7C55.9,39.4,55.5,39.3,55.3,39z"
            className="fill-[#FFB300]"
          />
          <path
            d="M45,50.4c0.7-0.5,1.5-1.1,2.3-1.9c1.7-5.2,6-9.2,11.4-10.3c0.4-0.1,0.8,0.1,1,0.4c0.2,0.3,0.2,0.6,0.1,0.9c-1.9,5.1-6.5,8.9-11.9,9.8c-0.8,0.7-1.6,1.4-2.3,1.9L45,50.4z"
            className="fill-[#FFCA28]"
          />
        </g>
      </g>
    </svg>
  );
};
