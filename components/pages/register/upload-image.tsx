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
  }, [initPhotos, next, withButton]);

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
    <Section className="flex h-full flex-col pb-4">
      <div className="my-4 rounded-xl border border-location-badge-bg/80 bg-location-badge-bg/45 px-3.5 py-3 dark:border-location-badge-bg-dark/70 dark:bg-location-badge-bg-dark/35">
        {title && (
          <>
            <Text
              fontWeight="bold"
              className="text-text-on-surface dark:text-grey-light"
            >
              {title[0]}
            </Text>
            <Text
              typography="t6"
              className="text-grey-dark dark:text-grey"
            >
              {title[1]}
            </Text>
          </>
        )}
      </div>

      <div className="mb-4 flex flex-col justify-center">
        <input
          type="file"
          onChange={handleImageChange}
          ref={fileInputRef}
          data-testid="file-input"
          className="hidden"
        />

        {/* 이미지 미리보기 */}
        <div className="flex flex-wrap justify-start gap-4">
          {initPhotos &&
            initPhotos.map((file, i) => {
              if (!file.previewURL || !file.id) return null;
              return (
                <div
                  key={`${file.previewURL} ${file.file} ${i}`}
                  className="relative h-16 w-16 rounded-lg border border-location-badge-bg/75 bg-location-badge-bg/40 shadow-xs dark:border-location-badge-bg-dark/70 dark:bg-location-badge-bg-dark/40"
                >
                  <button
                    className="absolute -top-2 -right-2 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white transition-colors duration-150 active:scale-[0.97] active:bg-primary-dark focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/30 dark:bg-primary-dark dark:active:bg-primary"
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
        <div data-testid="file-error" className="mt-2 min-h-5 text-center text-sm text-red">
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
          className="flex h-12 items-center justify-center"
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
    <button
      type="button"
      className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-text-on-surface-muted/45 bg-location-badge-bg/40 text-text-on-surface-muted transition-colors duration-150 active:scale-[0.98] active:border-primary/60 active:text-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/30 dark:border-location-badge-bg-dark/75 dark:bg-location-badge-bg-dark/30 dark:text-grey dark:active:border-primary-light/70 dark:active:text-primary-light"
      onClick={onClick}
    >
      <BsPlusLg size={24} />
    </button>
  );
};

export default UploadImage;
