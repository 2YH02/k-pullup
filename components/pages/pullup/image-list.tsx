"use client";

import ImageWrap from "@/app/article/2/image-wrap";
import type { Photo } from "@/types/marker.types";
import Text from "@common/text";
import { useToast } from "@hooks/useToast";
import deleteMarkerPhoto from "@lib/api/marker/delete-marker-photo";
import useAlertStore from "@store/useAlertStore";
import useImageModalStore from "@store/useImageModalStore";
import useUserStore from "@store/useUserStore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BsX } from "react-icons/bs";

type Props = {
  photos?: Photo[];
  markerId: number;
  markerUserId: number | null;
  isAdmin: boolean;
  onPhotoDeleted?: (photoId: number) => void;
};

const ImageList = ({
  photos,
  markerId,
  markerUserId,
  isAdmin,
  onPhotoDeleted,
}: Props) => {
  const { openModal, closeModal } = useImageModalStore();
  const { openAlert, closeAlert } = useAlertStore();
  const { user } = useUserStore();
  const { toast } = useToast();
  const [deletingPhotoId, setDeletingPhotoId] = useState<number | null>(null);
  const [visibleDeleteBtn, setVisibleDeleteBtn] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback((photoId: number) => {
    hoverTimerRef.current = setTimeout(() => {
      setVisibleDeleteBtn(photoId);
    }, 1000);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setVisibleDeleteBtn(null);
  }, []);

  const isOwnerOrAdmin = useMemo(() => {
    if (isAdmin) return true;
    if (!user || !markerUserId) return false;
    return user.userId === markerUserId;
  }, [user, markerUserId, isAdmin]);

  const images = useMemo(() => {
    if (!photos) return null;
    return photos.map((photo) => photo.photoUrl);
  }, [photos]);

  useEffect(() => {
    return () => {
      closeModal();
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  const handleDeletePhoto = async (photoId: number) => {
    setDeletingPhotoId(photoId);

    try {
      const response = await deleteMarkerPhoto(markerId, photoId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 403) {
          toast({ description: "사진을 삭제할 권한이 없습니다" });
        } else if (response.status === 400) {
          toast({ description: "잘못된 요청입니다" });
        } else {
          toast({ description: "잠시 후 다시 시도해주세요" });
        }
        return;
      }

      const data = await response.json();

      // Handle both success and idempotent cases
      if (data.message) {
        toast({
          description: data.message.includes("already")
            ? "이미 삭제된 사진입니다"
            : "사진이 삭제되었습니다"
        });

        // Notify parent component to update state
        onPhotoDeleted?.(photoId);
      }

      closeAlert();
    } catch (error) {
      toast({ description: "사진 삭제 중 오류가 발생했습니다" });
    } finally {
      setDeletingPhotoId(null);
    }
  };

  const handleDeleteClick = (photoId: number, e: React.MouseEvent) => {
    e.stopPropagation();

    openAlert({
      title: "사진을 삭제하시겠습니까?",
      description: "삭제된 사진은 복구할 수 없습니다.",
      onClickAsync: () => handleDeletePhoto(photoId),
      cancel: true,
    });
  };

  return (
    <div>
      {photos && images ? (
        <>
          {isOwnerOrAdmin && (
            <div className="flex justify-end mb-3 md:hidden">
              <button
                onClick={() => setIsEditMode((prev) => !prev)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  isEditMode
                    ? "bg-primary text-white dark:bg-primary-dark"
                    : "bg-grey-light text-grey-dark dark:bg-grey-dark dark:text-grey-light"
                }`}
              >
                {isEditMode ? "완료" : "사진 편집"}
              </button>
            </div>
          )}
          <div className="flex">
          <div className="w-1/2 mr-1">
            {photos.map((photo, i) => {
              if (i % 2 === 1) return;
              return (
                <div
                  key={photo.photoId}
                  className="relative w-full mb-2"
                  onMouseEnter={() => handleMouseEnter(photo.photoId)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className="w-full"
                    onClick={() => {
                      openModal({ images, curIndex: i });
                    }}
                  >
                    <ImageWrap
                      src={photo.photoUrl}
                      w={230}
                      h={230}
                      alt="상세"
                      className="rounded-md"
                    />
                  </button>
                  {isOwnerOrAdmin && (
                    <button
                      onClick={(e) => handleDeleteClick(photo.photoId, e)}
                      disabled={deletingPhotoId === photo.photoId}
                      className={`absolute top-2 right-2 bg-black/50 hover:bg-black/70 rounded-full p-1.5 transition-all duration-300 disabled:opacity-50 ${
                        isEditMode || visibleDeleteBtn === photo.photoId
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                      }`}
                      aria-label="사진 삭제"
                    >
                      <BsX size={20} className="text-white" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <div className="w-1/2 ml-1">
            {photos.map((photo, i) => {
              if (i % 2 !== 1) return;
              return (
                <div
                  key={photo.photoId}
                  className="relative w-full mb-2"
                  onMouseEnter={() => handleMouseEnter(photo.photoId)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className="w-full"
                    onClick={() => {
                      openModal({ images, curIndex: i });
                    }}
                  >
                    <ImageWrap
                      src={photo.photoUrl}
                      w={230}
                      h={230}
                      alt="상세"
                      className="rounded-md"
                    />
                  </button>
                  {isOwnerOrAdmin && (
                    <button
                      onClick={(e) => handleDeleteClick(photo.photoId, e)}
                      disabled={deletingPhotoId === photo.photoId}
                      className={`absolute top-2 right-2 bg-black/50 hover:bg-black/70 rounded-full p-1.5 transition-all duration-300 disabled:opacity-50 ${
                        isEditMode || visibleDeleteBtn === photo.photoId
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                      }`}
                      aria-label="사진 삭제"
                    >
                      <BsX size={20} className="text-white" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center w-full mt-2">
          <div className="mb-4">
            <ImageIcon />
          </div>
          <Text display="block" typography="t6">
            우와, 사진이 하나도 없네요 ㅜㅜ
          </Text>
        </div>
      )}
    </div>
  );
};

export default ImageList;

const ImageIcon = () => {
  return (
    <svg
      enableBackground="new 0 0 32 32"
      height="45px"
      version="1.1"
      viewBox="0 0 32 32"
      width="45px"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="picture_illustration_design_image">
        <g>
          <rect fill="#FFFFFF" height="23" width="29" x="1.5" y="4.5" />
          <path
            d="M30.5,28h-29C1.224,28,1,27.776,1,27.5v-23C1,4.224,1.224,4,1.5,4h29C30.776,4,31,4.224,31,4.5v23    C31,27.776,30.776,28,30.5,28z M2,27h28V5H2V27z"
            fill="#455A64"
          />
        </g>
        <rect fill="#A9E4FF" height="19" width="25" x="3.5" y="6.5" />
        <path
          d="M28.5,12.025l-0.023,0.001c-7.821,0-7.04,9.546-17.22,9.546C9.179,19.028,7.553,16.5,3.666,16.5l-0.166,9   h25C28.5,25.5,28.612,12.019,28.5,12.025z"
          fill="#1DE9B6"
        />
        <path
          d="M28.5,26h-23C5.224,26,5,25.776,5,25.5S5.224,25,5.5,25H28V6.5C28,6.224,28.224,6,28.5,6S29,6.224,29,6.5   v19C29,25.776,28.776,26,28.5,26z"
          fill="#455A64"
        />
        <path
          d="M3.5,26C3.224,26,3,25.776,3,25.5v-19C3,6.224,3.224,6,3.5,6h23C26.776,6,27,6.224,27,6.5S26.776,7,26.5,7   H4v18.5C4,25.776,3.776,26,3.5,26z"
          fill="#455A64"
        />
        <path
          d="M16.834,26c-2.557,0-4.2-2.038-5.94-4.195C8.989,19.442,7.019,17,3.666,17c-0.276,0-0.5-0.224-0.5-0.5   s0.224-0.5,0.5-0.5c3.832,0,6.05,2.751,8.007,5.178C13.327,23.229,14.755,25,16.834,25c0.276,0,0.5,0.224,0.5,0.5   S17.11,26,16.834,26z"
          fill="#455A64"
        />
        <path
          d="M11.612,22.077c-0.276,0-0.5-0.224-0.5-0.5s0.224-0.5,0.5-0.5c5.047,0,7.093-2.524,9.07-4.965   c1.801-2.223,3.664-4.521,7.642-4.607c0.279-0.01,0.505,0.214,0.511,0.489c0.006,0.276-0.213,0.505-0.489,0.511   c-3.514,0.075-5.077,2.004-6.886,4.237C19.434,19.242,17.137,22.077,11.612,22.077z"
          fill="#455A64"
        />
        <g>
          <circle cx="13" cy="12" fill="#FFF5A2" r="2.5" />
          <path
            d="M13,15c-1.654,0-3-1.346-3-3s1.346-3,3-3s3,1.346,3,3S14.654,15,13,15z M13,10c-1.103,0-2,0.897-2,2    s0.897,2,2,2s2-0.897,2-2S14.103,10,13,10z"
            fill="#455A64"
          />
        </g>
      </g>
    </svg>
  );
};
