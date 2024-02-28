"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/books/useOptimisticBooks";
import { type Book } from "@/lib/db/schema/books";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import BookForm from "@/components/books/BookForm";
import { type Author, type AuthorId } from "@/lib/db/schema/authors";

export default function OptimisticBook({
  book,
  authors,
  authorId,
}: {
  book: Book;

  authors: Author[];
  authorId?: AuthorId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Book) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticBook, setOptimisticBook] = useOptimistic(book);
  const updateBook: TAddOptimistic = (input) =>
    setOptimisticBook({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <BookForm
          book={optimisticBook}
          authors={authors}
          authorId={authorId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateBook}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticBook.title}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticBook.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticBook, null, 2)}
      </pre>
    </div>
  );
}
