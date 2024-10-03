import BottomFixedButton from "@common/bottom-fixed-button";
import Button from "@common/button";
import GrowBox from "@common/grow-box";
import Section from "@common/section";
import Text from "@common/text";
import LoadingIcon from "@icons/loading-icon";
import { resizeImage } from "img-toolkit";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
}

const UploadImage = ({ withButton = true, title, next }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<ImageUploadState[]>([]);
  const [hover, setHover] = useState(false);

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
    const suppertedFormats = [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/webp",
    ];

    if (!e.target.files) {
      setLoading(false);
      return;
    }

    if (!suppertedFormats.includes(e.target.files[0]?.type)) {
      setErrorMessage(
        "지원되지 않은 이미지 형식입니다. JPEG, PNG, webp형식의 이미지를 업로드해주세요."
      );
      setLoading(false);
      return;
    }

    if (images.length + e.target.files.length > 5) {
      setErrorMessage("최대 5개 까지 등록 가능합니다!");
      setLoading(false);
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
        <div>
          <div
            className="relative rounded-sm flex items-center justify-center h-14 cursor-pointer m-auto"
            onClick={handleBoxClick}
            onMouseEnter={() => {
              setHover(true);
            }}
            onMouseLeave={() => {
              setHover(false);
            }}
            style={{
              border: hover ? "2px dashed #444" : "1px dashed #444",
            }}
          >
            <ImageIcon
              className={`${hover ? "fill-primary-dark" : "fill-primary"}`}
            />
          </div>
          <input
            type="file"
            onChange={handleImageChange}
            ref={fileInputRef}
            data-testid="file-input"
            className="hidden"
          />
        </div>

        <div className="mt-2 flex flex-wrap">
          {images.map((image, index) => {
            return (
              <div key={index} className="flex flex-col items-center m-2">
                <div className="w-[70px] h-[70px]">
                  <Image
                    src={image.previewURL as string}
                    alt="다음"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    deleteImage(image.id as string);
                  }}
                  className="mt-1"
                  variant="contrast"
                >
                  삭제
                </Button>
              </div>
            );
          })}
        </div>

        <div
          data-testid="file-error"
          className="mt-1 text-center text-sm text-red"
        >
          {errorMessage}
        </div>
      </div>

      <GrowBox />

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

const ImageIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width={33}
      height={33}
    >
      <path
        d="M19 10a1 1 0 0 0-1 1v3.38l-1.48-1.48a2.79 2.79 0 0 0-3.93 0l-.7.71-2.48-2.49a2.79 2.79 0 0 0-3.93 0L4 12.61V7a1 1 0 0 1 1-1h8a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v12.22A2.79 2.79 0 0 0 4.78 22h12.44a2.88 2.88 0 0 0 .8-.12 2.74 2.74 0 0 0 2-2.65V11A1 1 0 0 0 19 10ZM5 20a1 1 0 0 1-1-1v-3.57l2.89-2.89a.78.78 0 0 1 1.1 0L15.46 20Zm13-1a1 1 0 0 1-.18.54L13.3 15l.71-.7a.77.77 0 0 1 1.1 0L18 17.21Zm3-15h-1V3a1 1 0 0 0-2 0v1h-1a1 1 0 0 0 0 2h1v1a1 1 0 0 0 2 0V6h1a1 1 0 0 0 0-2Z"
        className={className}
      ></path>
    </svg>
  );
};

export default UploadImage;
