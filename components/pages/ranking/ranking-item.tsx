import LocationIcon from "@icons/location-icon";

interface RankingItemProps {
  title: string;
}

const RankingItem = ({ title }: RankingItemProps) => {
  return (
    <button className="flex justify-between w-full px-4 py-5 border-b border-grey-light border-solid">
      <div>{title}</div>
      <div>
        <LocationIcon className="fill-grey-dark dark:fill-white" />
      </div>
    </button>
  );
};

export default RankingItem;
