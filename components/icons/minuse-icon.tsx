type Props = { size?: number };

const MinusIcon = ({ size = 24 }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className="stroke-black dark:stroke-white"
      fill="none"
    >
      <path
        d="M20 12H4"
        className="stroke-black dark:stroke-white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MinusIcon;
