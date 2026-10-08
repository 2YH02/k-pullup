const Section = ({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) => {
  return (
    <section className="mb-6 border-b border-grey-light/60 pb-5 last:border-0 last:pb-0 dark:border-grey-dark/70">
      <h2 className="mb-2 text-base font-bold leading-snug text-text-on-surface dark:text-grey-light">
        {title}
      </h2>
      <div className="break-words text-sm leading-7 text-grey-dark dark:text-grey-light">
        {children}
      </div>
    </section>
  );
};

export default Section;
