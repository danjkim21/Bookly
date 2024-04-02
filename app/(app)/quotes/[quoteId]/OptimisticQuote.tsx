"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/quotes/useOptimisticQuotes";
import { type Quote } from "@/lib/db/schema/quotes";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import QuoteForm from "@/components/quotes/QuoteForm";
import { type Book, type BookId } from "@/lib/db/schema/books";

export default function OptimisticQuote({
  quote,
  books,
  bookId
}: {
  quote: Quote;

  books: Book[];
  bookId?: BookId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Quote) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticQuote, setOptimisticQuote] = useOptimistic(quote);
  const updateQuote: TAddOptimistic = (input) =>
    setOptimisticQuote({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <QuoteForm
          quote={optimisticQuote}
          books={books}
          bookId={bookId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateQuote}
        />
      </Modal>
      <div className="mb-4 flex flex-wrap items-end justify-between">
        <h1 className="text-2xl font-semibold">{optimisticQuote.content}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "text-wrap break-all rounded-lg bg-secondary p-4",
          optimisticQuote.id === "optimistic" ? "animate-pulse" : ""
        )}
      >
        {JSON.stringify(optimisticQuote, null, 2)}
      </pre>
    </div>
  );
}
