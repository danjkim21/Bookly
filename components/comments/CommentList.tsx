"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Comment, CompleteComment } from "@/lib/db/schema/comments";
import Modal from "@/components/shared/Modal";
import { type BookShelf, type BookShelfId } from "@/lib/db/schema/bookShelves";
import { useOptimisticComments } from "@/app/(app)/comments/useOptimisticComments";
import { Button } from "@/components/ui/button";
import CommentForm from "./CommentForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (comment?: Comment) => void;

export default function CommentList({
  comments,
  bookShelves,
  bookShelfId
}: {
  comments: CompleteComment[];
  bookShelves: BookShelf[];
  bookShelfId?: BookShelfId;
}) {
  const { optimisticComments, addOptimisticComment } = useOptimisticComments(
    comments,
    bookShelves
  );
  const [open, setOpen] = useState(false);
  const [activeComment, setActiveComment] = useState<Comment | null>(null);
  const openModal = (comment?: Comment) => {
    setOpen(true);
    comment ? setActiveComment(comment) : setActiveComment(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeComment ? "Edit Comment" : "Create Comment"}
      >
        <CommentForm
          comment={activeComment}
          addOptimistic={addOptimisticComment}
          openModal={openModal}
          closeModal={closeModal}
          bookShelves={bookShelves}
          bookShelfId={bookShelfId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticComments.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticComments.map((comment) => (
            <Comment comment={comment} key={comment.id} openModal={openModal} />
          ))}
        </ul>
      )}
    </div>
  );
}

const Comment = ({
  comment,
  openModal
}: {
  comment: CompleteComment;
  openModal: TOpenModal;
}) => {
  const optimistic = comment.id === "optimistic";
  const deleting = comment.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("comments")
    ? pathname
    : pathname + "/comments/";

  return (
    <li
      className={cn(
        "my-2 flex justify-between",
        mutating ? "animate-pulse opacity-30" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <div className="w-full">
        <div>{comment.content}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + comment.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No comments
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new comment.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Comments{" "}
        </Button>
      </div>
    </div>
  );
};
