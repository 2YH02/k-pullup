"use client";

import type { User } from "@/types/user";
import updateUserName from "@api/user/update-username";
import Button from "@common/button";
import Input from "@common/input";
import Section from "@common/section";
import Text from "@common/text";
import useInput from "@hooks/useInput";
import EditIcon from "@icons/edit-icon";
import LoadingIcon from "@icons/loading-icon";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MIN_USERNAME_LENGTH = 3;

interface UsernameCardProps {
  user: User;
}

const UsernameCard = ({ user }: UsernameCardProps) => {
  const router = useRouter();

  const [usernameValue, setUsernameValue] = useState(user.username);

  const username = useInput(user.username);
  const [edit, setEdit] = useState(false);

  const [editError, setEditError] = useState("");
  const [loading, setLoading] = useState(false);

  const changeUsername = async () => {
    setLoading(true);
    if (username.value === user.username) {
      setEditError("현재 사용 중인 이름과 동일한 이름입니다.");
      setLoading(false);
      return;
    }

    if (username.value.length < MIN_USERNAME_LENGTH) {
      setEditError("사용자 이름은 최소 3자 이상이어야 합니다.");
      setLoading(false);
      return;
    }
    const response = await updateUserName(username.value);

    if (!response.ok) {
      setEditError("잠시 후 다시 시도해주세요");
      setLoading(false);
      return;
    }

    setUsernameValue(username.value);
    setLoading(false);
    setEdit(false);
    router.refresh();
  };

  return (
    <Section>
      <div className="rounded-xl border border-primary/10 bg-surface/80 p-4 dark:border-grey-dark dark:bg-black">
        <div className="mb-2 flex items-center justify-center">
          {edit ? (
            <div className="w-full max-w-72 rounded-lg border border-primary/10 bg-white/60 p-3 dark:border-grey-dark dark:bg-black-light">
              <Text
                display="block"
                textAlign="center"
                typography="t7"
                className="mb-2 text-grey-dark dark:text-grey"
              >
                닉네임은 최소 3자 이상 입력해주세요
              </Text>
              <div className="mx-auto w-full">
                <Input
                  isInvalid={!!editError}
                  value={username.value}
                  onChange={(e) => {
                    if (editError) {
                      setEditError("");
                    }
                    username.onChange(e);
                  }}
                />
              </div>
              <div className="h-4 mt-1">
                <div className="text-red text-xs text-center">{editError}</div>
              </div>
              <div className="mt-1 flex justify-center gap-2">
                <Button
                  onClick={() => {
                    setEditError("");
                    username.resetValue();
                    setEdit(false);
                  }}
                  variant="contrast"
                  className="h-8 w-16 rounded-md p-0 text-sm active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
                >
                  취소
                </Button>
                <Button
                  onClick={changeUsername}
                  className="flex h-8 w-16 items-center justify-center rounded-md p-0 text-sm active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
                  disabled={loading}
                >
                  {loading ? (
                    <LoadingIcon size="sm" className="text-white m-0" />
                  ) : (
                    "확인"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Text fontWeight="bold" className="text-primary dark:text-primary-light">
                {usernameValue}
              </Text>
              <button
                onClick={() => setEdit(true)}
                className="rounded-md p-1 transition-colors duration-150 web:hover:bg-primary/10 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
                aria-label="닉네임 수정"
              >
                <EditIcon size={16} color="primary" />
              </button>
            </div>
          )}
        </div>
        <Text
          display="block"
          textAlign="center"
          typography="t6"
          className="text-grey-dark dark:text-grey"
        >
          {user.email}
        </Text>
      </div>
    </Section>
  );
};

export default UsernameCard;
