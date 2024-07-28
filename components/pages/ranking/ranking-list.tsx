import type { RankingInfo } from "@api/marker/marker-ranking";
import ListItem, { ListContents, ListLeft } from "@common/list-item";
import Section from "@common/section";
import Text from "@common/text";
import PinIcon from "@icons/pin-icon";

interface RankingListProps {
  data: RankingInfo[];
}

const RankingList = ({ data }: RankingListProps) => {
  return (
    <Section>
      <ul>
        {data.map((item, index) => {
          return (
            <ListItem
              key={item.markerId}
              icon={<PinIcon size={30} />}
              onClick={() => {}}
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
