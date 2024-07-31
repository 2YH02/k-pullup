import LoadingIcon from "@/components/icons/loading-icon";
import BottomFixedButton from "@common/bottom-fixed-button";
import GrowBox from "@common/grow-box";
import Section from "@common/section";
import Text from "@common/text";
import MinusIcon from "@icons/minuse-icon";
import PlusIcon from "@icons/plus-icon";
import setNewFacilities from "@lib/api/marker/set-new-facilities";
import { useState } from "react";

interface SetFacilitiesProps {
  markerId: number | null;
  next: VoidFunction;
}

interface FacilityProps {
  name: string;
  count: number;
  increase: VoidFunction;
  decrease: VoidFunction;
}

const SetFacilities = ({ markerId, next }: SetFacilitiesProps) => {
  const [facilities, setFacilities] = useState({ 철봉: 0, 평행봉: 0 });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

    setLoading(false);
    next();
  };

  return (
    <Section className="h-full pb-0 flex flex-col">
      <div className="my-5">
        <Text fontWeight="bold">기구들의 개수를 입력해주시면</Text>
        <Text fontWeight="bold">
          다른 사람이 더욱 정확한 정보를 확인할 수 있습니다!
        </Text>
      </div>

      <div className="border border-solid border-primary rounded-md px-2">
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
      <Text typography="t6" className="text-red mt-3">
        {errorMessage}
      </Text>

      <GrowBox />

      <BottomFixedButton
        onClick={submit}
        className="flex items-center justify-center h-12"
        disabled={loading || (facilities.철봉 === 0 && facilities.평행봉 === 0)}
        containerStyle="px-0"
      >
        {loading ? (
          <LoadingIcon size="sm" className="text-white" />
        ) : (
          "등록하기"
        )}
      </BottomFixedButton>
    </Section>
  );
};

const FacilityList = ({ count, name, decrease, increase }: FacilityProps) => {
  return (
    <div className="flex items-center my-2">
      <Text>{name}</Text>
      <GrowBox />
      <span className="flex items-center">
        <button
          className="rounded-full p-1 hover:bg-white-tp-dark"
          onClick={() => decrease()}
        >
          <MinusIcon size={18} />
        </button>
        <Text className="flex items-center justify-center w-10">{count}</Text>
        <button
          className="rounded-full p-1 hover:bg-white-tp-dark"
          onClick={() => increase()}
        >
          <PlusIcon size={18} />
        </button>
      </span>
    </div>
  );
};

export default SetFacilities;
