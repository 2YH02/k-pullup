import Button from "@common/button";
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
  initPhotos: ImageUploadState[] | null;
  setInintPhotos: (photo: ImageUploadState) => void;
  deleteInintPhotos: (id: string) => void;
}

const UploadImage = ({
  withButton = true,
  title,
  initPhotos,
  setInintPhotos,
  deleteInintPhotos,
  next,
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (withButton || !initPhotos) return;
    const files = initPhotos.map((image) => {
      return image.file;
    });
    next(files as File[]);
  }, [initPhotos]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);

    if (!e.target.files || !e.target.files[0]) {
      setLoading(false);
      return;
    }

    const selectedFile = e.target.files[0];

    // Check max file count
    if (initPhotos && initPhotos.length >= 5) {
      setErrorMessage("최대 5개 까지 등록 가능합니다!");
      setLoading(false);
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
        setInintPhotos(imageData);
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
    }
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Section className="h-full pb-0 flex flex-col">
      <div className="my-5">
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
          {initPhotos &&
            initPhotos.map((file, i) => {
              if (!file.previewURL || !file.id) return null;
              return (
                <div
                  key={`${file.previewURL} ${file.file} ${i}`}
                  className="relative rounded-lg w-16 h-16 shadow-sm dark:border border-solid border-grey-dark"
                >
                  <button
                    className={`absolute -top-2 -right-2 rounded-full w-6 h-6 z-50 flex items-center justify-center bg-primary text-white`}
                    onClick={() => {
                      setErrorMessage("");
                      deleteInintPhotos(file.id as string);
                    }}
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

      {withButton && (
        <Button
          onClick={() => {
            if (initPhotos) {
              const imageData = initPhotos.map((image) => image.file as File);
              next(imageData);
            } else {
              next(null);
            }
          }}
          className="flex items-center justify-center h-12"
          disabled={loading}
        >
          {loading ? (
            <LoadingIcon size="sm" className="text-white m-0" />
          ) : !initPhotos || initPhotos.length <= 0 ? (
            "이미지 없이 위치 생성하기"
          ) : (
            "위치 생성하기"
          )}
        </Button>
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
