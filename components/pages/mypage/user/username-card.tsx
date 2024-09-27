"use client";

import type { User } from "@/types/user";
import updateUserName from "@api/user/update-username";
import Button from "@common/button";
import Input from "@common/input";
import Section from "@common/section";
import ShadowBox from "@common/shadow-box";
import Text from "@common/text";
import useInput from "@hooks/useInput";
import EditIcon from "@icons/edit-icon";
import LoadingIcon from "@icons/loading-icon";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
      <ShadowBox className="p-4">
        <div className="flex items-center justify-center mb-2">
          {edit ? (
            <div className="flex flex-col w-full">
              <div className="w-44 mx-auto">
                <Input
                  isInvalid={false}
                  value={username.value}
                  onChange={username.onChange}
                />
              </div>
              <div className="h-4">
                <div className="text-red text-xs text-center">{editError}</div>
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    setEditError("");
                    username.resetValue();
                    setEdit(false);
                  }}
                  variant="contrast"
                  className="text-sm w-14 h-8 p-0 mr-2"
                >
                  취소
                </Button>
                <Button
                  onClick={changeUsername}
                  className="text-sm w-14 h-8 p-0 flex items-center justify-center"
                  disabled={username.value.length < 2 || loading}
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
            <>
              <Text className="mr-3">{usernameValue}</Text>
              {user.provider === "website" && (
                <button onClick={() => setEdit(true)}>
                  <EditIcon size={17} color="black" />
                </button>
              )}
            </>
          )}
        </div>
        <Text display="block" textAlign="center" typography="t6">
          {user.email}
        </Text>
      </ShadowBox>
    </Section>
  );
};

export default UsernameCard;
