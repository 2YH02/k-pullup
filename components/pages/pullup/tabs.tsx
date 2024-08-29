"use client";

import Section from "@common/section";
import Text from "@common/text";
import { useMemo, useState } from "react";
// TODO: 이후에 공통 컴포넌트로 폴더 이동

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
  }, [curTab]);

  return (
    <div>
      <div className="bg-white dark:bg-black sticky top-0 flex z-40">
        {tabs.map((tab) => {
          return (
            <button
              key={tab.title}
              className={`flex-1 p-2 ${
                curTab === tab.title
                  ? "border-b border-solid border-primary-dark"
                  : "border-b border-solid border-grey-light"
              }`}
              onClick={() => setCurTab(tab.title)}
            >
              <Text>{tab.title}</Text>
            </button>
          );
        })}
      </div>
      <Section>{tabContents}</Section>
    </div>
  );
};

export default Tabs;
