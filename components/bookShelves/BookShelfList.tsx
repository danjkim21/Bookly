"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type BookShelf, CompleteBookShelf } from "@/lib/db/schema/bookShelves";
import Modal from "@/components/shared/Modal";

import { useOptimisticBookShelves } from "@/app/(app)/book-shelves/useOptimisticBookShelves";
import { Button } from "@/components/ui/button";
import BookShelfForm from "./BookShelfForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (bookShelf?: BookShelf) => void;

export default function BookShelfList({
  bookShelves
}: {
  bookShelves: CompleteBookShelf[];
}) {
  const { optimisticBookShelves, addOptimisticBookShelf } =
    useOptimisticBookShelves(bookShelves);
  const [open, setOpen] = useState(false);
  const [activeBookShelf, setActiveBookShelf] = useState<BookShelf | null>(
    null
  );
  const openModal = (bookShelf?: BookShelf) => {
    setOpen(true);
    bookShelf ? setActiveBookShelf(bookShelf) : setActiveBookShelf(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeBookShelf ? "Edit BookShelf" : "Create Book Shelf"}
      >
        <BookShelfForm
          bookShelf={activeBookShelf}
          addOptimistic={addOptimisticBookShelf}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticBookShelves.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticBookShelves.map((bookShelf) => (
            <BookShelf
              bookShelf={bookShelf}
              key={bookShelf.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const BookShelf = ({
  bookShelf,
  openModal
}: {
  bookShelf: CompleteBookShelf;
  openModal: TOpenModal;
}) => {
  const optimistic = bookShelf.id === "optimistic";
  const deleting = bookShelf.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("book-shelves")
    ? pathname
    : pathname + "/book-shelves/";

  return (
    <li
      className={cn(
        "my-2 flex justify-between",
        mutating ? "animate-pulse opacity-30" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <div className="w-full">
        <div>{bookShelf.title}</div>
      </div>
      {bookShelf.public && (
        <Button className='after:content-["_↗"]' variant="link" asChild>
          <Link href={bookShelf.slug}>Public Link</Link>
        </Button>
      )}
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + bookShelf.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No book shelves
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new book shelf.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Book Shelves{" "}
        </Button>
      </div>
    </div>
  );
};
