import Players from "@pages/home/players";
import SideMain from "@common/side-main";
import Section from "@/components/common/section";

const ArticleItemPage = () => {
  return (
    <SideMain headerTitle="철봉 가이드" hasBackButton fullHeight>
      <Section>
        <Players />
      </Section>
    </SideMain>
  );
};

export default ArticleItemPage;
