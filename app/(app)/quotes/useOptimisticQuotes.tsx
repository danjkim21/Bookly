import { type Book } from "@/lib/db/schema/books";
import { type Quote, type CompleteQuote } from "@/lib/db/schema/quotes";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Quote>) => void;

export const useOptimisticQuotes = (quotes: CompleteQuote[], books: Book[]) => {
  const [optimisticQuotes, addOptimisticQuote] = useOptimistic(
    quotes,
    (
      currentState: CompleteQuote[],
      action: OptimisticAction<Quote>,
    ): CompleteQuote[] => {
      const { data } = action;

      const optimisticBook = books.find((book) => book.id === data.bookId)!;

      const optimisticQuote = {
        ...data,
        book: optimisticBook,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticQuote]
            : [...currentState, optimisticQuote];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticQuote } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticQuote, optimisticQuotes };
};
