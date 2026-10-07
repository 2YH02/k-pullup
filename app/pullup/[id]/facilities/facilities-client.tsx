"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { FacilitiesRes } from "@api/marker/get-facilities";
import setNewFacilities from "@api/marker/set-new-facilities";
import BottomFixedButton from "@common/bottom-fixed-button";
import GrowBox from "@common/grow-box";
import Section from "@common/section";
import Text from "@common/text";
import LoadingIcon from "@icons/loading-icon";
import { FacilityList } from "@pages/register/set-facilities";

interface FacilityCounts {
  철봉: number;
  평행봉: number;
}

interface FacilitiesClientProps {
  markerId: number;
  initialFacilities: FacilitiesRes[];
}

const getInitialCounts = (facilities: FacilitiesRes[]): FacilityCounts => ({
  철봉: facilities.find(({ facilityId }) => facilityId === 1)?.quantity ?? 0,
  평행봉: facilities.find(({ facilityId }) => facilityId === 2)?.quantity ?? 0,
});

const FacilitiesClient = ({
  markerId,
  initialFacilities,
}: FacilitiesClientProps) => {
  const router = useRouter();

  const [initialCounts] = useState(() => getInitialCounts(initialFacilities));
  const [facilities, setFacilities] = useState<FacilityCounts>(initialCounts);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const isChanged =
    facilities.철봉 !== initialCounts.철봉 ||
    facilities.평행봉 !== initialCounts.평행봉;
  const isDisabled = loading || !isChanged;

  const updateFacility = (name: keyof FacilityCounts, amount: number) => {
    setErrorMessage("");
    setFacilities((prev) => ({
      ...prev,
      [name]: Math.min(99, Math.max(0, prev[name] + amount)),
    }));
  };

  const submit = async () => {
    if (loading || !isChanged) return;

    setLoading(true);
    setErrorMessage("");

    try {
      await setNewFacilities({
        markerId,
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

      router.replace(`/pullup/${markerId}`);
      router.refresh();
    } catch {
      setErrorMessage("저장하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col">
      <Section className="pb-0 pt-4">
        <div className="mb-4 rounded-2xl border border-primary/12 bg-search-input-bg/45 p-4 dark:border-white/10 dark:bg-black/30">
          <Text
            typography="t7"
            display="block"
            className="text-grey-dark dark:text-grey"
          >
            현재 기구 정보
          </Text>
          <Text
            typography="t4"
            fontWeight="bold"
            display="block"
            className="mt-0.5 text-primary dark:text-primary-light"
          >
            철봉 {facilities.철봉}개 · 평행봉 {facilities.평행봉}개
          </Text>
          <Text
            typography="t7"
            display="block"
            className="mt-2 text-grey-dark dark:text-grey"
          >
            현장에서 확인한 실제 개수로 수정해 주세요.
          </Text>
        </div>

        <div className="rounded-xl border border-primary/10 bg-search-input-bg/50 px-3 py-2 dark:border-grey-dark dark:bg-black/35">
          <FacilityList
            name="철봉"
            count={facilities.철봉}
            increase={() => updateFacility("철봉", 1)}
            decrease={() => updateFacility("철봉", -1)}
          />
          <FacilityList
            name="평행봉"
            count={facilities.평행봉}
            increase={() => updateFacility("평행봉", 1)}
            decrease={() => updateFacility("평행봉", -1)}
          />
        </div>
        <div aria-live="polite" className="min-h-6 pt-2">
          {errorMessage && (
            <Text typography="t7" display="block" className="text-red">
              {errorMessage}
            </Text>
          )}
        </div>
      </Section>
      <GrowBox />
      <BottomFixedButton
        onClick={submit}
        disabled={isDisabled}
        containerStyle="z-30"
      >
        {loading ? (
          <LoadingIcon size="sm" className="m-0 text-white" />
        ) : isChanged ? (
          "변경사항 저장"
        ) : (
          "변경사항 없음"
        )}
      </BottomFixedButton>
    </div>
  );
};

export default FacilitiesClient;
