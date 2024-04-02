"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/books/useOptimisticBooks";
import { type Book } from "@/lib/db/schema/books";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import BookForm from "@/components/books/BookForm";
import { type Author, type AuthorId } from "@/lib/db/schema/authors";
import { BookShelf, BookShelfId } from "@/lib/db/schema/bookShelves";
import BookDetailTable from "@/components/books/BookDetailTable";

export default function OptimisticBook({
  book,
  authors,
  authorId,
  bookShelves,
  bookShelfId
}: {
  book: Book;
  authors: Author[];
  authorId?: AuthorId;
  bookShelves?: BookShelf[];
  bookShelfId?: BookShelfId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Book) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticBook, setOptimisticBook] = useOptimistic(book);

  const authorName = authors
    ? authors
        .filter((author) => author.id === optimisticBook.authorId)
        .map((author) => author.name)
        .join(", ")
    : "None";

  const bookShelfTitle = bookShelves
    ? bookShelves
        .filter((bookShelf) => bookShelf.id === optimisticBook.bookShelfId)
        .map((bookShelf) => bookShelf.title)
        .join(", ")
    : "None";

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
          bookShelves={bookShelves}
        />
      </Modal>
      <div className="mb-4 h-32 w-24 overflow-hidden rounded-xl bg-neutral-100/50 object-cover dark:bg-neutral-800 md:mb-8">
        {/* TODO: Create book.url property in schema and add url img instead of this placeholder */}
      </div>
      <div className="mb-4 flex flex-wrap items-end justify-between">
        <h1 className="text-2xl font-semibold">{optimisticBook.title}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>

      <BookDetailTable
        optimisticBook={optimisticBook}
        authorName={authorName}
        bookShelfTitle={bookShelfTitle}
      />
    </div>
  );
}
