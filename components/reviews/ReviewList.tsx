"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Review, CompleteReview } from "@/lib/db/schema/reviews";
import Modal from "@/components/shared/Modal";
import { type Book, type BookId } from "@/lib/db/schema/books";
import { useOptimisticReviews } from "@/app/(app)/reviews/useOptimisticReviews";
import { Button } from "@/components/ui/button";
import ReviewForm from "./ReviewForm";
import { PlusIcon } from "lucide-react";
import StarIcon from "../shared/StarIcon";

type TOpenModal = (review?: Review) => void;

export default function ReviewList({
  reviews,
  books,
  bookId
}: {
  reviews: CompleteReview[];
  books: Book[];
  bookId?: BookId;
}) {
  const { optimisticReviews, addOptimisticReview } = useOptimisticReviews(
    reviews,
    books
  );
  const [open, setOpen] = useState(false);
  const [activeReview, setActiveReview] = useState<Review | null>(null);
  const openModal = (review?: Review) => {
    setOpen(true);
    review ? setActiveReview(review) : setActiveReview(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeReview ? "Edit Review" : "Create Review"}
      >
        <ReviewForm
          review={activeReview}
          addOptimistic={addOptimisticReview}
          openModal={openModal}
          closeModal={closeModal}
          books={books}
          bookId={bookId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticReviews.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticReviews.map((review) => (
            <Review review={review} key={review.id} openModal={openModal} />
          ))}
        </ul>
      )}
    </div>
  );
}

const Review = ({
  review,
  openModal
}: {
  review: CompleteReview;
  openModal: TOpenModal;
}) => {
  const optimistic = review.id === "optimistic";
  const deleting = review.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("reviews")
    ? pathname
    : pathname + "/reviews/";

  return (
    <li
      className={cn(
        "my-4 flex justify-between",
        mutating ? "animate-pulse opacity-30" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <div className="w-full">
        <div className="flex items-center">
          <StarIcon />
          <p className="ms-2 text-sm font-semibold text-muted-foreground">
            <span className="">{review.rating}</span> out of 5
          </p>
        </div>
        <blockquote className="text-background-foreground text-left font-normal italic dark:text-white">
          <p className='before:content-["\""] after:content-["\""]'>
            {review.content}
          </p>
        </blockquote>
        <Link href={`books/${review.bookId}`}>
          <div className="text-background-foreground text-sm font-medium text-muted-foreground dark:text-white">
            {review.book && review.book.title}
          </div>
        </Link>
      </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + review.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No reviews
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new review.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Reviews{" "}
        </Button>
      </div>
    </div>
  );
};
