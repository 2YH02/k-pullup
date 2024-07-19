import Input from "@common/input";
import SearchIcon from "@icons/search-icon";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta = {
  title: "common/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    isInvalid: { control: "boolean" },
    icon: { control: "text" },
    onIconClick: { action: "clicked" },
    isSearchButton: { control: "boolean" },
  },
  args: { onIconClick: fn(), isSearchButton: false },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/search",
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Valid: Story = {
  args: {
    isInvalid: false,
    icon: <SearchIcon />,
  },
};

export const Invalid: Story = {
  args: {
    isInvalid: true,
    icon: <SearchIcon />,
  },
};

export const WithoutIcon: Story = {
  args: {
    isInvalid: false,
  },
};
