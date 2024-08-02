import SideMain from "@common/side-main";
import LoadingIcon from "@icons/loading-icon";

const PageLoading = () => {
  return (
    <SideMain headerTitle=" " fullHeight withNav>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <LoadingIcon className="m-0" />
      </div>
    </SideMain>
  );
};

export default PageLoading;
