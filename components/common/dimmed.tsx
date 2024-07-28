interface DimmedProps {
  children: React.ReactNode;
  onClose?: VoidFunction;
}

const Dimmed = ({ onClose, children }: DimmedProps) => {
  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.7)] z-30"
      onClick={onClose || undefined}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
};

export default Dimmed;
