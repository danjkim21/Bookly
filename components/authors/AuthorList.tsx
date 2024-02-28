"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Author, CompleteAuthor } from "@/lib/db/schema/authors";
import Modal from "@/components/shared/Modal";

import { useOptimisticAuthors } from "@/app/(app)/authors/useOptimisticAuthors";
import { Button } from "@/components/ui/button";
import AuthorForm from "./AuthorForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (author?: Author) => void;

export default function AuthorList({ authors }: { authors: CompleteAuthor[] }) {
  const { optimisticAuthors, addOptimisticAuthor } =
    useOptimisticAuthors(authors);
  const [open, setOpen] = useState(false);
  const [activeAuthor, setActiveAuthor] = useState<Author | null>(null);
  const openModal = (author?: Author) => {
    setOpen(true);
    author ? setActiveAuthor(author) : setActiveAuthor(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeAuthor ? "Edit Author" : "Create Author"}
      >
        <AuthorForm
          author={activeAuthor}
          addOptimistic={addOptimisticAuthor}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticAuthors.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticAuthors.map((author) => (
            <Author author={author} key={author.id} openModal={openModal} />
          ))}
        </ul>
      )}
    </div>
  );
}

const Author = ({
  author,
  openModal
}: {
  author: CompleteAuthor;
  openModal: TOpenModal;
}) => {
  const optimistic = author.id === "optimistic";
  const deleting = author.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("authors")
    ? pathname
    : pathname + "/authors/";

  return (
    <li
      className={cn(
        "my-2 flex justify-between",
        mutating ? "animate-pulse opacity-30" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <div className="w-full">
        <div>{author.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + author.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No authors
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new author.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Authors{" "}
        </Button>
      </div>
    </div>
  );
};
