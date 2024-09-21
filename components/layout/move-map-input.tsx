"use client";

import { type Device } from "@/app/mypage/page";
import Input from "@common/input";
import ListItem, { ListContents } from "@common/list-item";
import Text from "@common/text";
import useInput from "@hooks/useInput";
import useMapControl from "@hooks/useMapControl";
import PinIcon from "@icons/pin-icon";
import cn from "@lib/cn";
import { MoveIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Dimmed from "@common/dimmed";
import CloseIcon from "@icons/close-icon";
import Tooltip from "../common/tooltip";

type KakaoPlace = {
  address_name: string;
  category_group_code: string;
  category_group_name: string;
  category_name: string;
  distance: string;
  id: string;
  phone: string;
  place_name: string;
  place_url: string;
  road_address_name: string;
  x: string;
  y: string;
};

type KakaoPagination = {
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  first: number;
  current: number;
  last: number;
  perPage: number;
  nextPage: VoidFunction;
  prevPage: VoidFunction;
};

const MoveMapInput = ({ deviceType }: { deviceType: Device }) => {
  const { move } = useMapControl();

  const searchValue = useInput("");

  const resultRef = useRef<HTMLDivElement>(null);

  const [result, setResult] = useState<KakaoPlace[]>([]);

  const [active, setActive] = useState(true);
  const [mobile, setMobile] = useState(false);

  const [searchStatus, setSearchStatus] = useState("");

  useEffect(() => {
    if (searchValue.value === "") {
      setResult([]);
      return;
    }

    let ps = new window.kakao.maps.services.Places();

    const placesSearchCB = (
      data: KakaoPlace[],
      status: string,
      _: KakaoPagination
    ) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setSearchStatus("");
        setResult([...data]);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        setSearchStatus("검색 결과가 존재하지 않습니다.");
        return;
      } else if (status === window.kakao.maps.services.Status.ERROR) {
        setSearchStatus("검색 결과 중 오류가 발생했습니다.");
        return;
      }
    };

    const handler = setTimeout(async () => {
      ps.keywordSearch(searchValue.value, placesSearchCB);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchValue.value]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 890) {
        setActive(false);
        setMobile(true);
      } else {
        setActive(true);
        setMobile(false);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobileApp =
    deviceType === "ios-mobile-app" || deviceType === "android-mobile-app";

  const style = isMobileApp ? "mo:top-[100px]" : "mo:top-16";
  const inputStyle = isMobileApp ? "mo:top-[100px]" : "";

  if (!active) {
    return (
      <Tooltip
        title="검색으로 지도 이동"
        className={`absolute right-5 mo:right-14 top-5 ${style} p-1 rounded-md z-[30] mo:z-[2] bg-white shadow-simple dark:bg-black hover:bg-grey-light hover:dark:bg-grey-dark`}
        position="left"
        as="button"
        onClick={() => setActive(true)}
      >
        <MoveIcon className="dark:stroke-white stroke-black" />
      </Tooltip>
    );
  }

  return (
    <Dimmed active={mobile} onClose={() => setActive(false)}>
      <div
        className={cn(
          "absolute top-5 mo:top-16 right-5 mo:right-1/2 mo:translate-x-1/2 z-[30] w-96 mo:w-full mo:px-4",
          inputStyle
        )}
      >
        <Input
          value={searchValue.value}
          onChange={searchValue.onChange}
          isInvalid={false}
          placeholder="위치 검색으로 지도 이동"
          placeholderAlign="center"
          className="px-10"
          icon={mobile ? <CloseIcon size={20} /> : true}
          onIconClick={mobile ? () => setActive(false) : undefined}
        />
        {(result.length > 0 || searchStatus !== "") && (
          <div
            ref={resultRef}
            className="mt-1 w-full h-72 bg-white rounded-md shadow-md p-4 overflow-auto scrollbar-thin"
          >
            {searchStatus !== "" ? (
              <Text textAlign="center" display="block" className="mt-4">
                {searchStatus}
              </Text>
            ) : (
              <>
                {result.map((searchItem) => {
                  return (
                    <ListItem
                      key={searchItem.id}
                      icon={<PinIcon size={25} />}
                      onClick={() => {
                        move({
                          lat: Number(searchItem.y),
                          lng: Number(searchItem.x),
                        });
                      }}
                    >
                      <ListContents
                        title={searchItem.place_name}
                        subTitle={searchItem.address_name}
                      />
                    </ListItem>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
    </Dimmed>
  );
};

export default MoveMapInput;
