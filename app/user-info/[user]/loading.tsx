import Section from "@common/section";
import SideMain from "@common/side-main";
import Skeleton from "@common/skeleton";

const Loading = () => {
  return (
    <SideMain hasBackButton headerTitle=" ">
      <Section>
        <div className="flex items-center">
          <Skeleton className="h-6 w-32 rounded-md" />
          <Skeleton className="ml-1 h-5 w-24 rounded-md" />
        </div>
      </Section>

      <div>
        <ul>
          {Array.from({ length: 4 }).map((_, i) => (
            <li
              key={i}
              className="flex items-center border-b border-solid p-2 px-4 dark:border-grey-dark"
            >
              <div className="flex w-[90%] flex-col gap-1.5">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3.5 w-1/2 rounded-md" />
              </div>
              <div className="flex w-[10%] shrink-0 items-center justify-center">
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </SideMain>
  );
};

export default Loading;
