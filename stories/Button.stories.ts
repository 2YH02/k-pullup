import Button from "@common/button";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta = {
  title: "common/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: { type: "select" },
      options: ["coral", "blue", "black", "primary"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: { type: "select" },
      options: ["normal", "contrast"],
    },
    className: {
      control: { type: "text" },
    },
    full: { control: "boolean" },
    disabled: { control: "boolean" },
    onClick: { action: "clicked" },
    children: { control: "text" },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    color: "primary",
    size: "md",
    variant: "normal",
    full: false,
    disabled: false,
    children: "Button",
  },
};

export const Contrast: Story = {
  args: {
    color: "blue",
    size: "md",
    variant: "contrast",
    full: false,
    disabled: false,
    children: "Button",
  },
};

export const Large: Story = {
  args: {
    color: "black",
    size: "lg",
    variant: "normal",
    full: false,
    disabled: false,
    children: "Button",
  },
};

export const Small: Story = {
  args: {
    color: "primary",
    size: "sm",
    variant: "normal",
    full: false,
    disabled: false,
    children: "Button",
  },
};

export const FullWidth: Story = {
  args: {
    color: "blue",
    size: "md",
    variant: "normal",
    full: true,
    disabled: false,
    children: "Button",
  },
};

export const Disabled: Story = {
  args: {
    color: "black",
    size: "md",
    variant: "normal",
    full: false,
    disabled: true,
    children: "Button",
  },
};
