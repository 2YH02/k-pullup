interface DimmedProps {
  children: React.ReactNode;
  onClose?: VoidFunction;
  onWheel?: (e: React.WheelEvent<HTMLDivElement>) => void;
}

const Dimmed = ({ onClose, onWheel, children }: DimmedProps) => {
  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.7)] z-30"
      onClick={onClose || undefined}
      onWheel={onWheel || undefined}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
};

export default Dimmed;
