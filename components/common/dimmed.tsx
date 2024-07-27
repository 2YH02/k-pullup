interface DimmedProps {
  children: React.ReactNode;
}

const Dimmed = ({ children }: DimmedProps) => {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.7)] z-30">
      {children}
    </div>
  );
};

export default Dimmed;
