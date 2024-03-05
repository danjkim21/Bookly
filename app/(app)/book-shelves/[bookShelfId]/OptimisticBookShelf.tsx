"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/book-shelves/useOptimisticBookShelves";
import { type BookShelf } from "@/lib/db/schema/bookShelves";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import BookShelfForm from "@/components/bookShelves/BookShelfForm";
import Link from "next/link";

export default function OptimisticBookShelf({
  bookShelf
}: {
  bookShelf: BookShelf;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: BookShelf) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticBookShelf, setOptimisticBookShelf] =
    useOptimistic(bookShelf);
  const updateBookShelf: TAddOptimistic = (input) =>
    setOptimisticBookShelf({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <BookShelfForm
          bookShelf={optimisticBookShelf}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateBookShelf}
        />
      </Modal>
      <div className="mb-4 flex items-end justify-between">
        <h1 className="text-2xl font-semibold">{optimisticBookShelf.title}</h1>
        {bookShelf.public && (
          <Button
            className='ml-auto after:content-["_↗"]'
            variant="link"
            asChild
          >
            <Link href={`/${bookShelf.slug}`}>Public Link</Link>
          </Button>
        )}
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "text-wrap break-all rounded-lg bg-secondary p-4",
          optimisticBookShelf.id === "optimistic" ? "animate-pulse" : ""
        )}
      >
        {JSON.stringify(optimisticBookShelf, null, 2)}
      </pre>
    </div>
  );
}
