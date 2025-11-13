import BottomFixedButton from "@common/bottom-fixed-button";
import GrowBox from "@common/grow-box";
import Section from "@common/section";
import Text from "@common/text";
import LoadingIcon from "@icons/loading-icon";
import {
  optimizeImage,
  OPTIMIZATION_PRESETS,
  ImageValidationError,
} from "@lib/optimize-image";
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

    if (!e.target.files || !e.target.files[0]) {
      setLoading(false);
      setLoadingFalse();
      return;
    }

    const selectedFile = e.target.files[0];

    // Check max file count
    if (images.length >= 5) {
      setErrorMessage("최대 5개 까지 등록 가능합니다!");
      setLoading(false);
      setLoadingFalse();
      return;
    }

    try {
      // Optimize image using the new utility with marker preset
      const optimizedFile = await optimizeImage(
        selectedFile,
        OPTIMIZATION_PRESETS.marker
      );

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = {
          file: optimizedFile,
          previewURL: reader.result as string,
          id: v4(),
        };
        setImages((prev) => [...prev, imageData]);
        setErrorMessage("");
      };

      reader.readAsDataURL(optimizedFile);
    } catch (error) {
      if (error instanceof ImageValidationError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("이미지 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      e.target.value = "";
      setLoading(false);
      setLoadingFalse();
    }
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
