"use client";

import type { Device } from "@/types/device";
import Section from "@/components/common/section";
import Text from "@/components/common/text";
import SideMain from "@common/side-main";
import useRegionAddress from "@hooks/useRegionAddress";
import LocationIcon from "@icons/location-icon";
import cn from "@/lib/cn";
import AroundSearch from "@pages/search/around-search";
import useGeolocationStore from "@store/useGeolocationStore";

interface Props {
  deviceType: Device;
}

const AroundClient = ({ deviceType }: Props) => {
  const { addressText, hasRegion } = useRegionAddress();
  const curLocation = useGeolocationStore((s) => s.curLocation);

  if (!hasRegion) {
    return (
      <SideMain headerTitle="내 주변 철봉" hasBackButton deviceType={deviceType}>
        <Section>
          {/* Error State Card */}
          <div
            className={cn(
              "relative isolate overflow-hidden",
              "p-6 rounded-2xl border border-white/70 dark:border-white/10",
              "bg-search-input-bg/65 dark:bg-black/32 backdrop-blur-md",
              "shadow-[0_10px_24px_rgba(64,64,56,0.08)] dark:shadow-[0_10px_24px_rgba(0,0,0,0.3)]",
              "flex flex-col items-center text-center mt-6"
            )}
          >
            <div
              aria-hidden
              className={cn(
                "absolute inset-0 pointer-events-none",
                "bg-linear-to-br from-white/35 via-transparent to-primary/10",
                "dark:from-white/8 dark:to-primary-dark/20"
              )}
            />
            <div className="relative w-16 h-16 rounded-full border border-white/45 dark:border-white/10 bg-white/35 dark:bg-white/6 flex items-center justify-center mb-4">
              <LocationIcon size={32} color="primary" />
            </div>
            <Text
              typography="t4"
              fontWeight="bold"
              display="block"
              className="relative mb-2 text-text-on-surface dark:text-grey-light"
            >
              현재 위치를 찾을 수 없습니다
            </Text>
            <Text
              typography="t6"
              display="block"
              className="relative text-text-on-surface-muted dark:text-grey mb-4"
            >
              위치 권한을 허용한 뒤 다시 시도해 주세요
            </Text>
            <div className="relative w-full max-w-xs space-y-2 text-left mt-2">
              <div className="flex items-start gap-2.5 rounded-xl p-2.5 bg-white/45 dark:bg-white/5">
                <Text
                  typography="t6"
                  className={cn(
                    "shrink-0 flex h-5 w-5 items-center justify-center rounded-full",
                    "bg-primary/12 dark:bg-primary-light/20",
                    "text-primary dark:text-primary-light font-bold"
                  )}
                >
                  1
                </Text>
                <Text typography="t7" className="text-text-on-surface-muted dark:text-grey">
                  브라우저의 위치 권한을 확인해 주세요
                </Text>
              </div>
              <div className="flex items-start gap-2.5 rounded-xl p-2.5 bg-white/45 dark:bg-white/5">
                <Text
                  typography="t6"
                  className={cn(
                    "shrink-0 flex h-5 w-5 items-center justify-center rounded-full",
                    "bg-primary/12 dark:bg-primary-light/20",
                    "text-primary dark:text-primary-light font-bold"
                  )}
                >
                  2
                </Text>
                <Text typography="t7" className="text-text-on-surface-muted dark:text-grey">
                  위치 권한을 허용하면 주변 철봉을 찾을 수 있어요
                </Text>
              </div>
            </div>
          </div>
        </Section>
      </SideMain>
    );
  }

  return (
    <SideMain headerTitle="내 주변 철봉" hasBackButton deviceType={deviceType}>
      <AroundSearch
        address={addressText}
        lat={curLocation.lat.toString()}
        lng={curLocation.lng.toString()}
      />
    </SideMain>
  );
};

export default AroundClient;
