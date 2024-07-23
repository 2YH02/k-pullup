import ToggleButton from "@common/toggle-button";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "common/ToggleButton",
  component: ToggleButton,
  tags: ["autodocs"],
  argTypes: {
    initValue: { control: "boolean" },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    onTrue: { action: "clicked" },
    onFalse: { action: "clicked" },
  },
  args: { onTrue: () => console.log(true), onFalse: () => console.log(false) },
} satisfies Meta<typeof ToggleButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
  },
};
