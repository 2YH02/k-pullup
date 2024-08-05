"use client";

import type { RankingInfo } from "@api/marker/marker-ranking";
import ListItem, { ListContents, ListLeft } from "@common/list-item";
import Section from "@common/section";
import Text from "@common/text";
import useMapControl from "@hooks/useMapControl";
import PinIcon from "@icons/pin-icon";
import { useRouter } from "next/navigation";

interface RankingListProps {
  data: RankingInfo[];
}

const RankingList = ({ data }: RankingListProps) => {
  const { move } = useMapControl();
  const router = useRouter();

  return (
    <Section>
      <ul>
        {data.map((item, index) => {
          return (
            <ListItem
              key={item.markerId}
              icon={<PinIcon size={30} />}
              onClick={() => {
                router.push(`/pullup/${item.markerId}`);
                move({ lat: item.latitude, lng: item.longitude });
              }}
            >
              <ListLeft>
                <div className="flex items-center">
                  <Text fontWeight="bold">{index + 1}</Text>
                  <Text typography="t7">등</Text>
                </div>
              </ListLeft>
              <ListContents title={item.address} />
            </ListItem>
          );
        })}
      </ul>
    </Section>
  );
};

export default RankingList;
