import ChatBubbleIcon from "@icons/chat-bubble-icon";
import HomeIcon from "@icons/home-icon";
import SignIcon from "@icons/sign-icon";
import UserIcon from "@icons/user-icon";
import Navigate from "@layout/navigate";
import cn from "@lib/cn";
import Text from "./text";

interface SideMainProps {
  title?: string;
  withNav?: boolean;
  clasName?: string;
  children?: React.ReactNode;
}

const menus = [
  {
    name: "홈",
    icon: <HomeIcon />,
    iconActive: <HomeIcon color="#fff" />,
    path: "/",
  },
  {
    name: "채팅",
    icon: <ChatBubbleIcon />,
    iconActive: <ChatBubbleIcon color="#fff" />,
    path: "/chat",
  },
  {
    name: "등록",
    icon: <SignIcon />,
    iconActive: <SignIcon color="#fff" />,
    path: "/register",
  },
  {
    name: "내 정보",
    icon: <UserIcon />,
    iconActive: <UserIcon color="#fff" />,
    path: "/mypage",
  },
];

const SideMain = ({ title, withNav, clasName, children }: SideMainProps) => {
  return (
    <main
      className={cn(
        `absolute top-6 bottom-6 left-6 max-w-96 w-full rounded-lg translate-x-0 
        overflow-y-auto overflow-x-hidden scrollbar-thin shadow-md bg-grey-light dark:bg-black`,
        clasName
      )}
    >
      <div
        className={`${withNav ? "px-4 pb-10" : "px-4"} min-h-[calc(100%-56px)]`}
      >
        <Text
          typography="t3"
          display="block"
          textAlign="center"
          className="pt-4"
        >
          {title}
        </Text>
        {children}
      </div>
      {withNav && <Navigate menus={menus} width={"full"} navClass="-mb-4" />}
    </main>
  );
};

export default SideMain;
