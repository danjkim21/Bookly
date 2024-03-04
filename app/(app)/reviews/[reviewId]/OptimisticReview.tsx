"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/reviews/useOptimisticReviews";
import { type Review } from "@/lib/db/schema/reviews";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import ReviewForm from "@/components/reviews/ReviewForm";
import { type Book, type BookId } from "@/lib/db/schema/books";

export default function OptimisticReview({
  review,
  books,
  bookId
}: {
  review: Review;

  books: Book[];
  bookId?: BookId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Review) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticReview, setOptimisticReview] = useOptimistic(review);
  const updateReview: TAddOptimistic = (input) =>
    setOptimisticReview({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <ReviewForm
          review={optimisticReview}
          books={books}
          bookId={bookId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateReview}
        />
      </Modal>
      <div className="mb-4 flex items-end justify-between">
        <h1 className="text-2xl font-semibold">{optimisticReview.content}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "text-wrap break-all rounded-lg bg-secondary p-4",
          optimisticReview.id === "optimistic" ? "animate-pulse" : ""
        )}
      >
        {JSON.stringify(optimisticReview, null, 2)}
      </pre>
    </div>
  );
}
