"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Book, CompleteBook } from "@/lib/db/schema/books";
import Modal from "@/components/shared/Modal";
import { type Author, type AuthorId } from "@/lib/db/schema/authors";
import { useOptimisticBooks } from "@/app/(app)/books/useOptimisticBooks";
import { Button } from "@/components/ui/button";
import BookForm from "./BookForm";
import { Heart, PlusIcon } from "lucide-react";
import { BookShelf } from "@/lib/db/schema/bookShelves";
import { updateBookFavoritedStatus } from "@/lib/api/books/mutations";
import BookFavoriteButton from "./BookFavoriteButton";

type TOpenModal = (book?: Book) => void;

export default function BookList({
  books,
  authors,
  authorId,
  bookShelves
}: {
  books: CompleteBook[];
  authors: Author[];
  authorId?: AuthorId;
  bookShelves?: BookShelf[];
}) {
  const { optimisticBooks, addOptimisticBook } = useOptimisticBooks(
    books,
    authors
  );

  const [open, setOpen] = useState(false);
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const openModal = (book?: Book) => {
    setOpen(true);
    book ? setActiveBook(book) : setActiveBook(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeBook ? "Edit Book" : "Create Book"}
      >
        <BookForm
          book={activeBook}
          addOptimistic={addOptimisticBook}
          openModal={openModal}
          closeModal={closeModal}
          authors={authors}
          authorId={authorId}
          bookShelves={bookShelves}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticBooks.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticBooks.map((book) => (
            <Book book={book} key={book.id} openModal={openModal} />
          ))}
        </ul>
      )}
    </div>
  );
}

const Book = ({
  book,
  openModal
}: {
  book: CompleteBook;
  openModal: TOpenModal;
}) => {
  const optimistic = book.id === "optimistic";
  const deleting = book.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("books") ? pathname : pathname + "/books/";

  return (
    <li
      className={cn(
        "my-4 flex items-center justify-between rounded-xl hover:bg-secondary",
        mutating ? "animate-pulse opacity-30" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <article className="flex w-full content-start justify-start">
        <div className="h-16 w-12 overflow-hidden rounded-xl bg-neutral-100/50 object-cover dark:bg-neutral-800">
          {/* TODO: Create book.url property in schema and add url img instead of this placeholder */}
        </div>
        <section className="ml-4 flex flex-col justify-center">
          <div className="font-medium text-primary">{book.title}</div>
          <div className="text-muted-foreground">{book.author?.name}</div>
        </section>
      </article>
      <BookFavoriteButton
        bookId={book.id}
        bookFavorited={book.favorited || false}
      />
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + book.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No books
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new book.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Books{" "}
        </Button>
      </div>
    </div>
  );
};
