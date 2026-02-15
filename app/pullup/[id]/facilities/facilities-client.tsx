"use client";

import setNewFacilities from "@api/marker/set-new-facilities";
import BottomFixedButton from "@common/bottom-fixed-button";
import GrowBox from "@common/grow-box";
import Section from "@common/section";
import Text from "@common/text";
import LoadingIcon from "@icons/loading-icon";
import { FacilityList } from "@pages/register/set-facilities";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FacilitiesClient = ({ markerId }: { markerId: number }) => {
  const router = useRouter();

  const [facilities, setFacilities] = useState({ 철봉: 0, 평행봉: 0 });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const isDisabled = loading || (facilities.철봉 === 0 && facilities.평행봉 === 0);

  const increaseChulbong = () => {
    setFacilities((prev) => ({
      ...prev,
      철봉: prev.철봉 + 1,
    }));
  };
  const decreaseChulbong = () => {
    setFacilities((prev) => ({
      ...prev,
      철봉: prev.철봉 - 1,
    }));
  };
  const increasePenghang = () => {
    setFacilities((prev) => ({
      ...prev,
      평행봉: prev.평행봉 + 1,
    }));
  };
  const decreasePenghang = () => {
    setFacilities((prev) => ({
      ...prev,
      평행봉: prev.평행봉 - 1,
    }));
  };

  const submit = async () => {
    setLoading(true);
    if (!markerId) {
      setErrorMessage("잠시 후 다시 시도해주세요.");
      setLoading(false);
      return;
    }

    const response = await setNewFacilities({
      markerId: markerId,
      facilities: [
        {
          facilityId: 1,
          quantity: facilities.철봉,
        },
        {
          facilityId: 2,
          quantity: facilities.평행봉,
        },
      ],
    });

    if (!response.ok) {
      setErrorMessage("잠시 후 다시 시도해주세요.");
      setLoading(false);
      return;
    }

    router.push(`/pullup/${markerId}`);
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex min-h-full flex-col">
      <Section className="pb-0 pt-4">
        <div className="mb-5 rounded-xl border border-location-badge-bg/80 bg-location-badge-bg/50 px-3.5 py-3 dark:border-location-badge-bg-dark/70 dark:bg-location-badge-bg-dark/35">
          <Text
            fontWeight="bold"
            className="text-text-on-surface dark:text-grey-light"
          >
            기구 개수를 입력하면
          </Text>
          <Text
            typography="t6"
            className="text-grey-dark dark:text-grey"
          >
            다른 사람이 더 정확한 정보를 확인할 수 있어요.
          </Text>
        </div>

        <div className="rounded-xl border border-primary/25 bg-search-input-bg/45 px-3 py-2 dark:border-primary-dark/50 dark:bg-black/30">
          <FacilityList
            name="철봉"
            count={facilities.철봉}
            increase={() => {
              if (facilities.철봉 === 99) return;
              increaseChulbong();
            }}
            decrease={() => {
              if (facilities.철봉 === 0) return;
              decreaseChulbong();
            }}
          />
          <FacilityList
            name="평행봉"
            count={facilities.평행봉}
            increase={() => {
              if (facilities.평행봉 === 99) return;
              increasePenghang();
            }}
            decrease={() => {
              if (facilities.평행봉 === 0) return;
              decreasePenghang();
            }}
          />
        </div>
        <Text typography="t6" className="mt-3 text-red">
          {errorMessage}
        </Text>
      </Section>
      <GrowBox />
      <BottomFixedButton
        onClick={submit}
        disabled={isDisabled}
        containerStyle="z-30"
      >
        {loading ? (
          <LoadingIcon size="sm" className="m-0 text-white" />
        ) : (
          "등록하기"
        )}
      </BottomFixedButton>
    </div>
  );
};

export default FacilitiesClient;
