import type { RankingInfo } from "@api/marker/marker-ranking";
import RankingItem from "./ranking-item";

interface RankingListProps {
  data: RankingInfo[];
}

const RankingList = ({ data }: RankingListProps) => {
  return (
    <ul>
      {data.map((item, index) => {
        return (
          <RankingItem
            key={item.markerId}
            title={item.address}
            ranking={index + 1}
          />
        );
      })}
    </ul>
  );
};

export default RankingList;
