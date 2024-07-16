"use client";

import Text from "@common/text";
import ChatBubbleIcon from "@icons/chat-bubble-icon";
import HomeIcon from "@icons/home-icon";
import SignIcon from "@icons/sign-icon";
import UserIcon from "@icons/user-icon";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const Navigate = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [idx, setInx] = useState(getPathIndex(pathname));
  const [sizeUp, setSizeUp] = useState(true);

  const menus = [
    {
      name: "홈",
      icon: <HomeIcon />,
      iconAvtive: <HomeIcon color="#fff" />,
      dis: "translate-x-[24px]",
      path: "/",
    },
    {
      name: "채팅",
      icon: <ChatBubbleIcon />,
      iconAvtive: <ChatBubbleIcon color="#fff" />,
      dis: "translate-x-[120px]",
      path: "/chat",
    },
    {
      name: "등록",
      icon: <SignIcon />,
      iconAvtive: <SignIcon color="#fff" />,
      dis: "translate-x-[216px]",
      path: "/register",
    },
    {
      name: "내 정보",
      icon: <UserIcon />,
      iconAvtive: <UserIcon color="#fff" />,
      dis: "translate-x-[312px]",
      path: "/mypage",
    },
  ];

  const handleClick = (i: number, url: string) => {
    setSizeUp(false);
    setInx(i);
    setTimeout(() => {
      setSizeUp(true);
      router.push(url);
    }, 150);
  };

  return (
    <nav className="sticky bottom-0 h-14 -m-4 shadow-lg bg-white w-96">
      <span
        className={`absolute top-1/2 ${menus[idx].dis} -translate-y-1/2 ${
          !sizeUp ? "scale-[0.2]" : "scale-100"
        } duration-150 bg-coral h-12 w-12 rounded-full`}
      />
      <ul className="relative flex justify-around items-center h-full">
        {menus.map((menu, i) => (
          <NavLink
            key={menu.name}
            title={menu.name}
            icon={idx == i && sizeUp ? menu.iconAvtive : menu.icon}
            isActive={idx == i && sizeUp}
            onClick={() => handleClick(i, menu.path)}
          />
        ))}
      </ul>
    </nav>
  );
};

const NavLink = ({
  title,
  icon,
  isActive,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: VoidFunction;
}) => {
  return (
    <li className=" w-1/4 z-20">
      <div
        className="relative flex flex-col justify-center cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center justify-center z-20">{icon}</div>
        <Text
          typography="t7"
          display="block"
          textAlign="center"
          fontWeight="bold"
          className={`${isActive ? "text-white" : "text-gray-500"} z-20`}
        >
          {title}
        </Text>
      </div>
    </li>
  );
};

const getPathIndex = (pathname: string) => {
  let result;

  switch (pathname) {
    case "/":
      result = 0;
      break;
    case "/chat":
      result = 1;
      break;
    case "/register":
      result = 2;
      break;
    case "/mypage":
      result = 3;
      break;
    default:
      result = 0;
  }

  return result;
};

export default Navigate;
