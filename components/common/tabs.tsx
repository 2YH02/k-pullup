"use client";

import Section from "@common/section";
import Text from "@common/text";
import { useMemo, useState } from "react";

interface TabData {
  title: string;
  contents: React.ReactNode;
}

interface TabsProps {
  tabs: TabData[];
}

const Tabs = ({ tabs }: TabsProps) => {
  const [curTab, setCurTab] = useState(tabs[0].title);

  const tabContents = useMemo(() => {
    return tabs.find((tab) => tab.title === curTab)?.contents;
  }, [curTab, tabs]);

  return (
    <div>
      <div
        className="sticky top-0 z-40 flex border-b border-primary/10 bg-side-main/95 px-4 pt-2 backdrop-blur-xs dark:border-grey-dark dark:bg-black/90"
        role="tablist"
        aria-label="공지사항 분류"
      >
        {tabs.map((tab) => {
          const isActive = curTab === tab.title;
          return (
            <button
              key={tab.title}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`relative flex-1 rounded-t-lg px-2 py-2.5 transition-[color,background-color,transform] duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 motion-reduce:transform-none motion-reduce:transition-none ${
                isActive
                  ? "bg-primary/8 text-primary dark:bg-primary-light/10 dark:text-primary-light"
                  : "text-grey-dark web:hover:bg-search-input-bg/60 dark:text-grey dark:web:hover:bg-black/35"
              }`}
              onClick={() => setCurTab(tab.title)}
            >
              <Text typography="t6" fontWeight={isActive ? "bold" : "normal"}>
                {tab.title}
              </Text>
              {isActive && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary dark:bg-primary-light" />
              )}
            </button>
          );
        })}
      </div>
      <Section className="py-4">
        <div role="tabpanel">{tabContents}</div>
      </Section>
    </div>
  );
};

export default Tabs;
