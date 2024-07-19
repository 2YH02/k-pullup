import inputField from "@common/input-field";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "common/InputField",
  component: inputField,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    isError: { control: "boolean" },
    message: { action: "text" },
    placeholder: { control: "text" },
  },
  args: { label: "비밀번호", placeholder: "비밀번호 입력", isError: false },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/search",
      },
    },
  },
} satisfies Meta<typeof inputField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const ErrorWithMessage: Story = {
  args: {
    isError: true,
    message: "에러 메시지",
  },
};
