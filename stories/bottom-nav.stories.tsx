import ChatBubbleIcon from "@icons/chat-bubble-icon";
import HomeIcon from "@icons/home-icon";
import SignIcon from "@icons/sign-icon";
import UserIcon from "@icons/user-icon";
import BottomNav from "@layout/bottom-nav";
import type { Meta, StoryObj } from "@storybook/react";

const menus = [
  {
    name: "홈",
    icon: <HomeIcon />,
    iconActive: <HomeIcon className="fill-white" />,
    path: "/",
  },
  {
    name: "채팅",
    icon: <ChatBubbleIcon />,
    iconActive: <ChatBubbleIcon className="fill-white" />,
    path: "/chat",
  },
  {
    name: "등록",
    icon: <SignIcon />,
    iconActive: <SignIcon className="fill-white" />,
    path: "/register",
  },
  {
    name: "내 정보",
    icon: <UserIcon />,
    iconActive: <UserIcon className="fill-white" />,
    path: "/mypage",
  },
];

const meta = {
  title: "layout/BottomNav",
  component: BottomNav,
  tags: ["autodocs"],
  argTypes: {
    menus: {
      control: { type: "object" },
    },
    width: {
      control: { type: "select" },
    },
    className: {
      control: { type: "text" },
    },
  },
  args: {
    menus: menus,
    className: "",
    width: "full",
  },
} satisfies Meta<typeof BottomNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const fullWidth: Story = {
  args: {
    width: "full",
  },
};
