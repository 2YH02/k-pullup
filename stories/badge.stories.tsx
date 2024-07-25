import Badge from "@common/badge";
import LocationIcon from "@icons/location-icon";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta = {
  title: "common/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    icon: { control: "text" },
    text: { control: "text" },
    textStyle: { control: "text" },
    withBorder: { control: "boolean" },
    className: { control: "text" },
    isButton: { control: "boolean" },
    onClick: { action: "clicked" },
  },
  args: { onClick: fn(), withBorder: true, isButton: false, text: "badge" },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithoutBorder: Story = {
  args: {
    withBorder: false,
  },
};

export const WithIcon: Story = {
  args: {
    icon: <LocationIcon size={20} className="fill-primary-dark" />,
  },
};
