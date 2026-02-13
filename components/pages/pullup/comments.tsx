"use client";

import createComment from "@api/comment/create-comment";
import deleteComment from "@api/comment/delete-comment";
import getComments, { type Comment } from "@api/comment/get-comments";
import BottomSheet from "@common/bottom-sheet";
import Button from "@common/button";
import Skeleton from "@common/skeleton";
import Text from "@common/text";
import Textarea from "@common/textarea";
import useInput from "@hooks/useInput";
import { useToast } from "@hooks/useToast";
import cn from "@lib/cn";
import { formatDate } from "@lib/format-date";
import useAlertStore from "@store/useAlertStore";
import { useBottomSheetStore } from "@store/useBottomSheetStore";
import { useProviderStore } from "@store/useProviderStore";
import useUserStore from "@store/useUserStore";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsX } from "react-icons/bs";

interface CommentsProps {
  markerId: number;
  initialComments: import("@api/comment/get-comments").CommentsRes;
}

const Comments = ({ markerId, initialComments }: CommentsProps) => {
  const router = useRouter();

  const { toast } = useToast();
  const { user } = useUserStore();
  const { openAlert } = useAlertStore();
  const { hide } = useBottomSheetStore();
  const { providerInfo, setProviderInfo } = useProviderStore();

  const commentValue = useInput("");

  const [comments, setComments] = useState<Comment[]>([]);

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [commentsLoading, setCommentsLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadMoreComments = useCallback(async () => {
    if (commentsLoading || currentPage >= totalPages) return;

    setCommentsLoading(true);
    const newData = await getComments({
      id: markerId,
      pageParam: currentPage + 1,
    });

    if (newData.error) {
      return;
    }

    setComments((prev) => [...prev, ...newData.comments]);
    setCurrentPage(newData.currentPage);

    setCommentsLoading(false);
  }, [currentPage, commentsLoading, totalPages, markerId]);

  useEffect(() => {
    // Use server-provided initial data instead of fetching on mount
    if (initialComments.error) {
      setCommentsLoading(false);
      return;
    }

    const providerData = initialComments.comments.filter(
      (comment) => comment.username === "k-pullup"
    );

    const commentsData = initialComments.comments.filter(
      (comment) => comment.username !== "k-pullup"
    );

    setProviderInfo([...providerData]);
    setComments(commentsData);
    setTotalPages(initialComments.totalPages);
    setCommentsLoading(false);
  }, [initialComments, setProviderInfo]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreComments();
        }
      },
      {
        rootMargin: "100px",
      }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreComments]);

  const handleCreate = async () => {
    if (commentValue.value.length <= 0) {
      return;
    }
    setCreateLoading(true);
    const response = await createComment({
      markerId: markerId,
      commentText: commentValue.value,
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.error === "Comment contains inappropriate content.") {
        toast({ description: "댓글에 비속어를 포함할 수 없습니다." });
        setCreateLoading(false);
        return;
      } else if (response.status === 400) {
        toast({ description: "이미 3개의 댓들을 작성하였습니다." });
        setCreateLoading(false);
        return;
      } else if (response.status === 401) {
        openAlert({
          title: "로그인이 필요합니다.",
          description: "로그인 페이지로 이동하시겠습니까?",
          onClick: () => {
            router.push(`/signin?returnUrl=/pullup/${markerId}`);
          },
          cancel: true,
        });
        setCreateLoading(false);
        return;
      }
      toast({ description: "잠시 후 다시 시도해주세요" });
      setCreateLoading(false);
      return;
    }

    setComments((prev) => {
      if (data.username !== "k-pullup") {
        const nonKIndex = prev.findIndex(
          (comment) => comment.username !== "k-pullup"
        );
        if (nonKIndex === -1) {
          return [data, ...prev];
        }
        return [...prev.slice(0, nonKIndex), data, ...prev.slice(nonKIndex)];
      }
      setProviderInfo([...providerInfo, data]);
      return [...prev];
    });
    setCreateLoading(false);
    hide();
    commentValue.resetValue();
  };

  const handleDelete = async (commentId: number) => {
    setDeleteLoading(true);
    const response = await deleteComment(commentId);

    if (!response.ok) {
      toast({ description: "잠시 후 다시 시도해주세요" });
      setDeleteLoading(false);
      return;
    }

    const newComment = await getComments({
      id: markerId,
      pageParam: 1,
    });
    setComments(newComment.comments);
    setCurrentPage(1);
    setDeleteLoading(false);
  };

  return (
    <div>
      {comments.length <= 0 && !commentsLoading && (
        <div className="flex flex-col items-center justify-center mt-2 mb-4">
          <div className="mb-4">
            <CommentIcon />
          </div>
          <Text typography="t6">우와, 댓글이 하나도 없네요 ㅜㅜ</Text>
        </div>
      )}
      {comments.map((comment, index) => {
        // if (comment.username === "c") {
        //   return (
        // <ListItem
        //   key={comment.commentId}
        //   icon={
        //     user?.chulbong || user?.userId === comment.userId ? (
        //       <BsX size={22} color="#777" />
        //     ) : undefined
        //   }
        //   onIconClick={async () => {
        //     if (
        //       deleteLoading ||
        //       !user ||
        //       (!user.chulbong && user.userId !== comment.userId)
        //     )
        //       return;
        //     await handleDelete(comment.commentId);
        //   }}
        // >
        //   <ListContents
        //     title={comment.commentText}
        //     subTitle={formatDate(comment.postedAt)}
        //   />

        //   <ListRight>
        //     <Text typography="t7">{comment.username}</Text>
        //   </ListRight>
        // </ListItem>
        //   );
        // }
        return (
          <div
            key={comment.commentId}
            className={cn("p-2", {
              "border-b border-solid border-[#ddd]":
                index !== comments.length - 1,
            })}
          >
            <div className="flex justify-between items-center mb-1">
              <Text typography="t6" fontWeight="bold">
                {comment.username}
              </Text>

              {(user?.chulbong || user?.userId === comment.userId) && (
                <button
                  onClick={() => {
                    if (
                      deleteLoading ||
                      !user ||
                      (!user.chulbong && user.userId !== comment.userId)
                    )
                      return;

                    openAlert({
                      title: "삭제",
                      description: "작성하신 댓글을 삭제하시겠습니까?",
                      onClick: async () => {
                        await handleDelete(comment.commentId);
                      },
                      cancel: true,
                    });
                  }}
                >
                  <BsX size={22} color="#777" />
                </button>
              )}
            </div>
            <div>
              <Text className="break-all text-[15px]">
                {comment.commentText}
              </Text>
            </div>
            <div>
              <Text typography="t7" className="text-grey">
                {formatDate(comment.postedAt)}
              </Text>
            </div>
          </div>
        );
      })}

      {commentsLoading && <Skeleton className="w-full h-16 rounded-lg mt-4" />}
      {totalPages > currentPage && (
        <div ref={loadMoreRef} className="w-full h-20" />
      )}

      <BottomSheet title="리뷰 작성" id={`write-comments`} className="pb-10">
        {!user?.error ? (
          <div>
            <Textarea
              value={commentValue.value}
              onChange={commentValue.onChange}
              maxLength={40}
              placeholder="다른 사람에게 불쾌감을 주는 욕설, 혐오, 비하의 표현은 주의해주세요."
              className="mb-4"
            />
            <div className="flex items-center">
              <Button
                className="w-3/4 bg-primary"
                onClick={handleCreate}
                disabled={createLoading}
              >
                등록하기
              </Button>
              <div className="grow" />
              <div className="mr-2 text-black dark:text-grey-light">
                {commentValue.value.length}/40
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-5 text-black dark:text-white">
              먼저 로그인을 해주셔야 해요.
            </div>
            <Button
              className="bg-primary"
              onClick={() => {
                openAlert({
                  title: "로그인이 필요합니다.",
                  description: "로그인 페이지로 이동하시겠습니까?",
                  onClick: () => {
                    router.push(`/signin?returnUrl=/pullup/${markerId}`);
                  },
                  cancel: true,
                });
                hide();
              }}
              full
            >
              로그인 하러 가기
            </Button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};

const CommentIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={60}
      height={60}
    >
      <circle cx="255.4" cy="256" r="215.6" className="fill-[#EEEDF2]" />

      <g className="stroke-[#1E247E] stroke-6 stroke-linecap-round">
        <line x1="455.1" x2="471" y1="471.6" y2="471.6" />
        <line x1="77.2" x2="438.7" y1="471.6" y2="471.6" />
        <line x1="39.8" x2="60.7" y1="471.6" y2="471.6" />
      </g>

      <path
        d="M406.9,292.5v152.6c0,14.1-11.4,25.5-25.5,25.5h-252c-14.1,0-25.5-11.4-25.5-25.5V292.5c0-2.7,0.5-5.4,1.6-7.9c1.1-2.7,2.7-5.2,4.9-7.2l122.5-116.9c12.6-12,32.4-12,45.1,0l122.5,116.9c2.2,2.1,3.8,4.5,4.9,7.2C406.3,287.1,406.9,289.8,406.9,292.5z"
        className="fill-none stroke-[#1E247E] stroke-6 stroke-linecap-round"
      />

      <line
        x1="202.3"
        x2="308.5"
        y1="300.9"
        y2="300.9"
        className="stroke-[#1E247E] stroke-6 stroke-linecap-round"
      />
      <line
        x1="202.3"
        x2="308.5"
        y1="315.7"
        y2="315.7"
        className="stroke-[#1E247E] stroke-6 stroke-linecap-round"
      />
      <line
        x1="202.3"
        x2="308.5"
        y1="330.4"
        y2="330.4"
        className="stroke-[#1E247E] stroke-6 stroke-linecap-round"
      />

      <circle
        cx="361.7"
        cy="205.5"
        r="35"
        className="fill-[#DA867D] stroke-[#1E247E] stroke-6"
      />
      <circle
        cx="317.1"
        cy="117.2"
        r="35"
        className="fill-[#79CAA1] stroke-[#1E247E] stroke-6"
      />
      <circle
        cx="220.4"
        cy="98.3"
        r="35"
        className="fill-[#F0C330] stroke-[#1E247E] stroke-6"
      />
    </svg>
  );
};

export default Comments;
