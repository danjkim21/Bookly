import {
  type BookShelf,
  type CompleteBookShelf
} from "@/lib/db/schema/bookShelves";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<BookShelf>) => void;

export const useOptimisticBookShelves = (bookShelves: CompleteBookShelf[]) => {
  const [optimisticBookShelves, addOptimisticBookShelf] = useOptimistic(
    bookShelves,
    (
      currentState: CompleteBookShelf[],
      action: OptimisticAction<BookShelf>
    ): CompleteBookShelf[] => {
      const { data } = action;

      const optimisticBookShelf = {
        ...data,

        id: "optimistic"
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticBookShelf]
            : [...currentState, optimisticBookShelf];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticBookShelf } : item
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

  return { addOptimisticBookShelf, optimisticBookShelves };
};
