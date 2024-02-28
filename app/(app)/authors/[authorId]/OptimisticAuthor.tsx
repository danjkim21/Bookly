"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/authors/useOptimisticAuthors";
import { type Author } from "@/lib/db/schema/authors";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import AuthorForm from "@/components/authors/AuthorForm";

export default function OptimisticAuthor({ author }: { author: Author }) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Author) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticAuthor, setOptimisticAuthor] = useOptimistic(author);
  const updateAuthor: TAddOptimistic = (input) =>
    setOptimisticAuthor({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <AuthorForm
          author={optimisticAuthor}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateAuthor}
        />
      </Modal>
      <div className="mb-4 flex items-end justify-between">
        <h1 className="text-2xl font-semibold">{optimisticAuthor.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "text-wrap break-all rounded-lg bg-secondary p-4",
          optimisticAuthor.id === "optimistic" ? "animate-pulse" : ""
        )}
      >
        {JSON.stringify(optimisticAuthor, null, 2)}
      </pre>
    </div>
  );
}
