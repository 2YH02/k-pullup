const Section = ({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-black dark:text-white mb-2">
        {title}
      </h2>
      <div className="text-grey-dark dark:text-grey-light text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export default Section;
