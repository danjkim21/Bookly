"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/comments/useOptimisticComments";
import { type Comment } from "@/lib/db/schema/comments";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import CommentForm from "@/components/comments/CommentForm";
import { type BookShelf, type BookShelfId } from "@/lib/db/schema/bookShelves";

export default function OptimisticComment({
  comment,
  bookShelves,
  bookShelfId
}: {
  comment: Comment;

  bookShelves: BookShelf[];
  bookShelfId?: BookShelfId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Comment) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticComment, setOptimisticComment] = useOptimistic(comment);
  const updateComment: TAddOptimistic = (input) =>
    setOptimisticComment({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <CommentForm
          comment={optimisticComment}
          bookShelves={bookShelves}
          bookShelfId={bookShelfId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateComment}
        />
      </Modal>
      <div className="mb-4 flex items-end justify-between">
        <h1 className="text-2xl font-semibold">{optimisticComment.content}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "text-wrap break-all rounded-lg bg-secondary p-4",
          optimisticComment.id === "optimistic" ? "animate-pulse" : ""
        )}
      >
        {JSON.stringify(optimisticComment, null, 2)}
      </pre>
    </div>
  );
}
