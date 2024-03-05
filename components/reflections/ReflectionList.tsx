"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  type Reflection,
  CompleteReflection
} from "@/lib/db/schema/reflections";
import Modal from "@/components/shared/Modal";
import { type Book, type BookId } from "@/lib/db/schema/books";
import { useOptimisticReflections } from "@/app/(app)/reflections/useOptimisticReflections";
import { Button } from "@/components/ui/button";
import ReflectionForm from "./ReflectionForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (reflection?: Reflection) => void;

export default function ReflectionList({
  reflections,
  books,
  bookId
}: {
  reflections: CompleteReflection[];
  books: Book[];
  bookId?: BookId;
}) {
  const { optimisticReflections, addOptimisticReflection } =
    useOptimisticReflections(reflections, books);
  const [open, setOpen] = useState(false);
  const [activeReflection, setActiveReflection] = useState<Reflection | null>(
    null
  );
  const openModal = (reflection?: Reflection) => {
    setOpen(true);
    reflection ? setActiveReflection(reflection) : setActiveReflection(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeReflection ? "Edit Reflection" : "Create Reflection"}
      >
        <ReflectionForm
          reflection={activeReflection}
          addOptimistic={addOptimisticReflection}
          openModal={openModal}
          closeModal={closeModal}
          books={books}
          bookId={bookId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticReflections.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticReflections.map((reflection) => (
            <Reflection
              reflection={reflection}
              key={reflection.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Reflection = ({
  reflection,
  openModal
}: {
  reflection: CompleteReflection;
  openModal: TOpenModal;
}) => {
  const optimistic = reflection.id === "optimistic";
  const deleting = reflection.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("reflections")
    ? pathname
    : pathname + "/reflections/";

  return (
    <li
      className={cn(
        "my-4 flex justify-between",
        mutating ? "animate-pulse opacity-30" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <div className="w-full">
        <blockquote className="text-background-foreground text-left font-normal italic  dark:text-white">
          <p className='before:content-["\""] after:content-["\""]'>
            {reflection.content}
          </p>
        </blockquote>
        <Link href={`books/${reflection.bookId}`}>
          <div className="text-background-foreground text-sm font-medium text-muted-foreground dark:text-white">
            {reflection.book && reflection.book.title}
          </div>
        </Link>
      </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + reflection.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No reflections
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new reflection.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Reflections{" "}
        </Button>
      </div>
    </div>
  );
};
