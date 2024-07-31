type Props = { size?: number };

const PlusIcon = ({ size = 24 }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 4V20"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-black dark:stroke-white"
      />
      <path
        d="M4 12H20"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-black dark:stroke-white"
      />
    </svg>
  );
};

export default PlusIcon;
