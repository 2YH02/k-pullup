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
    navClass: {
      control: { type: "text" },
    },
  },
  args: {
    menus: menus,
    navClass: "",
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
