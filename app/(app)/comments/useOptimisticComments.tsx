import { type BookShelf } from "@/lib/db/schema/bookShelves";
import { type Comment, type CompleteComment } from "@/lib/db/schema/comments";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Comment>) => void;

export const useOptimisticComments = (
  comments: CompleteComment[],
  bookShelves: BookShelf[]
) => {
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (
      currentState: CompleteComment[],
      action: OptimisticAction<Comment>
    ): CompleteComment[] => {
      const { data } = action;

      const optimisticBookShelf = bookShelves.find(
        (bookShelf) => bookShelf.id === data.bookShelfId
      )!;

      const optimisticComment = {
        ...data,
        bookShelf: optimisticBookShelf,
        id: "optimistic"
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticComment]
            : [...currentState, optimisticComment];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticComment } : item
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

  return { addOptimisticComment, optimisticComments };
};
