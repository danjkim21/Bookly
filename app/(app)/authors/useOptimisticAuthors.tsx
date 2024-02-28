import { type Author, type CompleteAuthor } from "@/lib/db/schema/authors";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Author>) => void;

export const useOptimisticAuthors = (authors: CompleteAuthor[]) => {
  const [optimisticAuthors, addOptimisticAuthor] = useOptimistic(
    authors,
    (
      currentState: CompleteAuthor[],
      action: OptimisticAction<Author>
    ): CompleteAuthor[] => {
      const { data } = action;

      const optimisticAuthor = {
        ...data,

        id: "optimistic"
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticAuthor]
            : [...currentState, optimisticAuthor];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticAuthor } : item
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

  return { addOptimisticAuthor, optimisticAuthors };
};
