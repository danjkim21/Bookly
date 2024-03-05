import { type Book } from "@/lib/db/schema/books";
import { type Review, type CompleteReview } from "@/lib/db/schema/reviews";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Review>) => void;

export const useOptimisticReviews = (
  reviews: CompleteReview[],
  books: Book[]
) => {
  const [optimisticReviews, addOptimisticReview] = useOptimistic(
    reviews,
    (
      currentState: CompleteReview[],
      action: OptimisticAction<Review>
    ): CompleteReview[] => {
      const { data } = action;

      const optimisticBook = books.find((book) => book.id === data.bookId)!;

      const optimisticReview = {
        ...data,
        book: optimisticBook,
        id: "optimistic"
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticReview]
            : [...currentState, optimisticReview];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticReview } : item
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item
          );
        default:
          return currentState;
      }
    }
  );

  return { addOptimisticReview, optimisticReviews };
};
