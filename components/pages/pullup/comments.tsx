"use client";

import Button from "@common/button";
import ListItem, { ListContents, ListRight } from "@common/list-item";
import Skeleton from "@common/skeleton";
import Text from "@common/text";
import Textarea from "@common/textarea";
import useInput from "@hooks/useInput";
import { useToast } from "@hooks/useToast";
import createComment from "@lib/api/comment/create-comment";
import deleteComment from "@lib/api/comment/delete-comment";
import getComments, { type Comment } from "@lib/api/comment/get-comments";
import { formatDate } from "@lib/format-date";
import useAlertStore from "@store/useAlertStore";
import useUserStore from "@store/useUserStore";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface CommentsProps {
  markerId: number;
}

const Comments = ({ markerId }: CommentsProps) => {
  const router = useRouter();

  const { toast } = useToast();
  const { user } = useUserStore();
  const { openAlert } = useAlertStore();

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
  }, [currentPage, commentsLoading, totalPages]);

  useEffect(() => {
    const fetch = async () => {
      setCommentsLoading(true);
      const data = await getComments({ id: markerId, pageParam: currentPage });

      if (data.error) {
        setCommentsLoading(false);
        return;
      }

      setComments(data.comments);
      setTotalPages(data.totalPages);
      setCommentsLoading(false);
    };
    fetch();
  }, []);

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
    // TODO: 응답 유저 이름 확인 필요
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

    setComments((prev) => [data, ...prev]);
    setCreateLoading(false);
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
      <div className="mb-3 border border-solid border-primary rounded-md p-1">
        <Textarea
          placeholder="다른 사람에게 불쾌감을 주는 욕설, 혐오, 비하의 표현은 주의해주세요."
          rows={2}
          value={commentValue.value}
          onChange={commentValue.onChange}
          className="placeholder:text-xs border-none focus:border-none"
        />
        <div className="flex items-center justify-between border-t border-solid p-1 pb-0">
          <span>
            <Text typography="t6">{commentValue.value.length}</Text>
            <Text typography="t6">/</Text>
            <Text typography="t6">40</Text>
          </span>
          <Button onClick={handleCreate} size="sm" disabled={createLoading}>
            등록
          </Button>
        </div>
      </div>

      {comments.length <= 0 && !commentsLoading && (
        <Text>등록된 댓글이 없습니다.</Text>
      )}

      {comments.map((comment) => {
        return (
          <ListItem
            key={comment.commentId}
            icon={
              user?.chulbong || user?.userId === comment.userId ? (
                <Trash2Icon className="stroke-grey-dark" size={20} />
              ) : undefined
            }
            onIconClick={async () => {
              if (
                deleteLoading ||
                !user ||
                (!user.chulbong && user.userId !== comment.userId)
              )
                return;
              await handleDelete(comment.commentId);
            }}
          >
            <ListContents
              title={comment.commentText}
              subTitle={formatDate(comment.postedAt)}
            />

            <ListRight>{comment.username}</ListRight>
          </ListItem>
        );
      })}

      {commentsLoading && <Skeleton className="w-full h-16 rounded-lg" />}
      {totalPages > currentPage && (
        <div ref={loadMoreRef} className="w-full h-20" />
      )}
    </div>
  );
};

export default Comments;
