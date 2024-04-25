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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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
        <ul className="space-y-2">
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
        "my-2 flex items-start justify-start gap-4",
        mutating ? "animate-pulse opacity-30" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      {/* TODO: add user name/info to comment query */}
      <Avatar className="shrink-0">
        <AvatarImage alt="Dan Kim" src="/placeholder-user.jpg" />
        <AvatarFallback className="border-2 border-border text-muted-foreground">
          DK
        </AvatarFallback>
      </Avatar>

      <div>
        <div className="flex flex-col items-start gap-1 md:flex-row md:items-center ">
          <div className="font-medium">{comment.userId}</div>
          <div className="text-sm text-muted-foreground dark:text-gray-400">
            {comment.createdAt.toLocaleString()}
            <Button variant={"link"} asChild>
              <Link href={basePath + "/" + comment.id}>Edit</Link>
            </Button>
          </div>
        </div>
        <p className="text-sm">{comment.content}</p>
      </div>
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
