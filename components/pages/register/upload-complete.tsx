"use client";

import type { UploadStatus } from "@/app/register/register-client";
import Button from "@common/button";
import Section from "@common/section";
import Text from "@common/text";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { registerError } from "@/app/register/register-client";

interface UploadCompleteProps {
  returnUrl: string;
  status: UploadStatus;
  errorMessage: string;
  next: VoidFunction;
  resetStep: VoidFunction;
  setStep: (step: number) => void;
}

const UploadComplete = ({
  returnUrl,
  status,
  errorMessage,
  next,
  resetStep,
  setStep,
}: UploadCompleteProps) => {
  const router = useRouter();

  const message = useMemo(() => {
    return uploadStatusText(status);
  }, [status]);

  return (
    <Section className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-[140px]">
        <Image
          src={
            status === "complete"
              ? "/congratulations.gif"
              : status === "error"
              ? "/error.gif"
              : "/upload.gif"
          }
          alt="회원가입 로딩"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-full object-cover"
          priority={true}
        />
      </div>

      {status !== "error" && (
        <>
          {message?.map((text) => {
            return (
              <Text
                key={text}
                typography="t4"
                fontWeight="bold"
                className="mt-10"
              >
                {text}
              </Text>
            );
          })}
        </>
      )}
      {status == "error" && (
        <Text typography="t4" fontWeight="bold" className="mt-10">
          {errorMessage || "잠시 후 다시 시도해주세요"}
        </Text>
      )}
      {status === "error" && (
        <Button
          onClick={() => {
            if (errorMessage === registerError[400]) {
              setStep(2);
            } else {
              resetStep();
            }
          }}
          full
          className="mt-10"
        >
          돌아가기
        </Button>
      )}
      {status === "complete" && (
        <>
          <div className="flex items-center justify-center mt-3">
            <Button
              onClick={() => {
                router.replace(returnUrl || "/");
              }}
              variant="contrast"
              className="mr-5"
              size="sm"
            >
              위치 상세보기
            </Button>
            <Button onClick={next} size="sm">
              기구 개수 등록하기
            </Button>
          </div>
          <div className="mt-3 w-full text-center">
            <Text typography="t6" className="text-red">
              정확한 정보를 위해
            </Text>
            <Text typography="t6" className="text-red">
              해당 위치의 철봉과 평행봉 개수를 등록해주세요.
            </Text>
          </div>
        </>
      )}
    </Section>
  );
};

const uploadStatusText = (status: UploadStatus) => {
  if (status === "image") return ["이미지 등록 중..."];
  if (status === "location") return ["위치 등록 중..."];
  if (status === "complete") return ["장소 등록이 완료되었습니다!!"];
  if (status === "error") return ["잠시 후 다시 시도해주세요..."];
};

export default UploadComplete;
