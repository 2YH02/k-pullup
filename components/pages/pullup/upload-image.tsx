import BottomFixedButton from "@common/bottom-fixed-button";
import GrowBox from "@common/grow-box";
import Section from "@common/section";
import Text from "@common/text";
import LoadingIcon from "@icons/loading-icon";
import { resizeImage } from "img-toolkit";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BsPlusLg, BsX } from "react-icons/bs";
import { v4 } from "uuid";

export interface ImageUploadState {
  file: File | null;
  previewURL: string | null;
  id: string | null;
}

interface ImageUploadProps {
  withButton?: boolean;
  title?: string[];
  next: (photos: File[] | null) => void;
  setLoadingTrue: VoidFunction;
  setLoadingFalse: VoidFunction;
}

const UploadImage = ({
  withButton = true,
  title,
  next,
  setLoadingFalse,
  setLoadingTrue,
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<ImageUploadState[]>([]);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (withButton) return;
    const files = images.map((image) => {
      return image.file;
    });
    next(files as File[]);
  }, [images]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setLoadingTrue();
    const suppertedFormats = [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/webp",
    ];

    if (!e.target.files) {
      setLoading(false);
      setLoadingFalse();
      return;
    }

    if (!suppertedFormats.includes(e.target.files[0]?.type)) {
      setErrorMessage(
        "지원되지 않은 이미지 형식입니다. JPEG, PNG, webp형식의 이미지를 업로드해주세요."
      );
      setLoading(false);
      setLoadingFalse();
      return;
    }

    if (images.length + e.target.files.length > 5) {
      setErrorMessage("최대 5개 까지 등록 가능합니다!");
      setLoading(false);
      setLoadingFalse();
      return;
    }

    let file: File = await resizeImage(e.target.files[0], {
      format: "webp",
      quality: 0.8,
    });
    let reader = new FileReader();

    reader.onloadend = () => {
      const imageData = {
        file: file,
        previewURL: reader.result as string,
        id: v4(),
      };
      setImages((prev) => [...prev, imageData]);
    };

    // if (file.size / (1024 * 1024) > 10) {
    //   setErrorMessage("이미지는 최대 10MB까지 가능합니다.");
    //   setLoading(false);
    //   return;
    // }

    setErrorMessage("");

    reader.readAsDataURL(file);

    e.target.value = "";
    setLoading(false);
    setLoadingFalse();
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const deleteImage = (id: string) => {
    const filtered = images.filter((image) => image.id !== id);
    setImages(filtered);
  };

  return (
    <Section className="h-full pb-0 flex flex-col">
      {/* 업로드 이미지 섹션 타이틀 */}
      <div className="mb-1">
        {title && (
          <>
            {title.map((text) => {
              return (
                <Text fontWeight="bold" key={text}>
                  {text}
                </Text>
              );
            })}
          </>
        )}
      </div>

      <div className="flex flex-col justify-center mb-4">
        <input
          type="file"
          onChange={handleImageChange}
          ref={fileInputRef}
          data-testid="file-input"
          className="hidden"
        />

        {/* 이미지 미리보기 */}
        <div className="flex justify-start gap-4 flex-wrap">
          {images.map((file, i) => {
            if (!file.previewURL || !file.id) return null;
            return (
              <div
                key={`${file.previewURL} ${file.file} ${i}`}
                className="relative rounded-lg w-16 h-16 shadow-sm dark:border border-solid border-grey-dark"
              >
                <button
                  className={`absolute -top-2 -right-2 rounded-full w-6 h-6 z-50 flex items-center justify-center bg-primary text-white`}
                  onClick={() => deleteImage(file.id as string)}
                >
                  <BsX size={20} />
                </button>
                <Image
                  src={file.previewURL}
                  alt="report"
                  className="object-cover rounded-lg"
                  fill
                />
              </div>
            );
          })}

          {/* 이미지 업로드 버튼 */}
          <AddImageButton onClick={handleBoxClick} />
        </div>

        {/* 에러 메시지 */}
        <div
          data-testid="file-error"
          className="mt-1 text-center text-sm text-red"
        >
          {errorMessage}
        </div>
      </div>

      <GrowBox />

      {/* 다음 버튼 */}
      {withButton && (
        <BottomFixedButton
          onClick={() => {
            const imageData = images.map((image) => image.file as File);
            next(imageData.length <= 0 ? null : imageData);
          }}
          disabled={loading}
          className="flex items-center justify-center h-12"
          containerStyle="px-0"
        >
          {loading ? (
            <LoadingIcon size="sm" className="text-white m-0" />
          ) : images.length <= 0 ? (
            "이미지 없이 다음으로"
          ) : (
            "다음"
          )}
        </BottomFixedButton>
      )}
    </Section>
  );
};

const AddImageButton = ({ onClick }: { onClick: VoidFunction }) => {
  return (
    <div
      className="relative rounded-lg flex items-center justify-center shrink-0 h-16 w-16 cursor-pointer border-2 border-dashed border-grey-dark text-black dark:text-white"
      onClick={onClick}
    >
      <BsPlusLg size={24} />
    </div>
  );
};

export default UploadImage;
