import Button from "./button";
import Dimmed from "./dimmed";
import Text from "./text";

interface Props {
  open?: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
  buttonLabel?: string;
  onClick?: VoidFunction;
}

const Alert = ({
  open,
  title,
  description,
  buttonLabel = "확인",
  onClick,
}: Props) => {
  if (!open) return null;

  return (
    <Dimmed>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 p-6
        overflow-hidden bg-white dark:bg-black rounded-lg z-40"
      >
        <Text
          typography="t4"
          fontWeight="bold"
          display="block"
          className="mb-2"
        >
          {title}
        </Text>

        {description && <Text typography="t7">{description}</Text>}

        {onClick && (
          <div className="flex justify-end mt-3">
            <Button onClick={onClick} size="sm">
              {buttonLabel}
            </Button>
          </div>
        )}
      </div>
    </Dimmed>
  );
};

export default Alert;
