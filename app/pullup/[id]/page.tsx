import Badge from "@common/badge";
import Divider from "@common/divider";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import getFacilities from "@lib/api/marker/get-facilities";
import getWeather from "@lib/api/marker/get-weather";
import markerDetail from "@lib/api/marker/marker-detail";
import ButtonList from "@pages/pullup/button-list";
import Comments from "@pages/pullup/comments";
import ImageCarousel from "@pages/pullup/image-carousel";
import ImageList from "@pages/pullup/image-list";
import NotFoud from "@pages/pullup/not-foud";
import Tabs from "@pages/pullup/tabs";
import { cookies } from "next/headers";

const PullupPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const marker = await markerDetail({ id: ~~id, cookie: decodeCookie });
  const facilities = await getFacilities(~~id);

  if (marker.error === "Marker not found") {
    return <NotFoud />;
  }

  const weather = await getWeather(marker.latitude, marker.longitude);

  const 철봉 = facilities.find((item) => item.facilityId === 1);
  const 평행봉 = facilities.find((item) => item.facilityId === 2);

  const tabData = [
    { title: "사진", contents: <ImageList photos={marker.photos} /> },
    { title: "댓글", contents: <Comments markerId={marker.markerId} /> },
  ];

  return (
    <SideMain headerTitle="위치 상세" hasBackButton withNav>
      <Section>
        <div>
          <ImageCarousel photos={marker.photos} />
        </div>

        <div className="flex items-center mt-2">
          {!철봉 ||
            !평행봉 ||
            (철봉.quantity <= 0 && 평행봉.quantity <= 0 && (
              <Badge
                text={`기구 개수 정보 없음`}
                className="flex items-center justify-center mr-2 h-8"
              />
            ))}
          {철봉 && 철봉.quantity > 0 && (
            <Badge
              text={`철봉 ${철봉?.quantity}개`}
              className="flex items-center justify-center mr-2 h-8"
            />
          )}
          {평행봉 && 평행봉.quantity > 0 && (
            <Badge
              text={`평행봉 ${평행봉?.quantity}개`}
              className="flex items-center justify-center mr-2 h-8"
            />
          )}
          {weather && (
            <Badge
              icon={<img src={weather.iconImage} className="w-6" />}
              text={`${weather.temperature} °C`}
              className="flex items-center justify-center h-8"
            />
          )}
        </div>

        <Text typography="t4" className="w-full break-words mt-3">
          {marker.address}
        </Text>
        <Text typography="t6" className="w-full break-words">
          {marker.description || "작성된 설명이 없습니다."}
        </Text>
      </Section>

      <Section className="pb-1">
        <ButtonList marker={marker} />
      </Section>

      <Divider className="h-3" />

      <Tabs tabs={tabData} />
    </SideMain>
  );
};

export default PullupPage;
