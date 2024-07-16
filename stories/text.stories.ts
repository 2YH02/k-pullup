import Text from "@common/text";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "common/Text",
  component: Text,
  tags: ["autodocs"],
  argTypes: {
    typography: {
      control: { type: "select" },
      options: ["t1", "t2", "t3", "t4", "t5", "t6", "t7"],
    },
    display: {
      control: { type: "select" },
      options: ["inline", "block", "inline-block"],
    },
    textAlign: {
      control: { type: "select" },
      options: ["left", "center", " right"],
    },
    fontWeight: {
      control: { type: "select" },
      options: ["normal", "bold", "lighter", "bolder"],
    },
    className: {
      control: { type: "text" },
    },
    children: { control: "text" },
  },
  args: {
    display: "inline",
    textAlign: "left",
    fontWeight: "normal",
    children: "텍스트",
  },
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const t1: Story = {
  args: {
    typography: "t1",
  },
};

export const t2: Story = {
  args: {
    typography: "t2",
  },
};

export const t3: Story = {
  args: {
    typography: "t3",
  },
};

export const t4: Story = {
  args: {
    typography: "t4",
  },
};

export const t5: Story = {
  args: {
    typography: "t5",
  },
};

export const t6: Story = {
  args: {
    typography: "t6",
  },
};

export const t7: Story = {
  args: {
    typography: "t7",
  },
};
