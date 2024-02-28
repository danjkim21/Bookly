"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Quote, CompleteQuote } from "@/lib/db/schema/quotes";
import Modal from "@/components/shared/Modal";
import { type Book, type BookId } from "@/lib/db/schema/books";
import { useOptimisticQuotes } from "@/app/(app)/quotes/useOptimisticQuotes";
import { Button } from "@/components/ui/button";
import QuoteForm from "./QuoteForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (quote?: Quote) => void;

export default function QuoteList({
  quotes,
  books,
  bookId
}: {
  quotes: CompleteQuote[];
  books: Book[];
  bookId?: BookId;
}) {
  const { optimisticQuotes, addOptimisticQuote } = useOptimisticQuotes(
    quotes,
    books
  );
  const [open, setOpen] = useState(false);
  const [activeQuote, setActiveQuote] = useState<Quote | null>(null);
  const openModal = (quote?: Quote) => {
    setOpen(true);
    quote ? setActiveQuote(quote) : setActiveQuote(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeQuote ? "Edit Quote" : "Create Quote"}
      >
        <QuoteForm
          quote={activeQuote}
          addOptimistic={addOptimisticQuote}
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
      {optimisticQuotes.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticQuotes.map((quote) => (
            <Quote quote={quote} key={quote.id} openModal={openModal} />
          ))}
        </ul>
      )}
    </div>
  );
}

const Quote = ({
  quote,
  openModal
}: {
  quote: CompleteQuote;
  openModal: TOpenModal;
}) => {
  const optimistic = quote.id === "optimistic";
  const deleting = quote.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("quotes")
    ? pathname
    : pathname + "/quotes/";

  return (
    <li
      className={cn(
        "my-2 flex justify-between",
        mutating ? "animate-pulse opacity-30" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <div className="w-full">
        <div>{quote.content}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + quote.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No quotes
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new quote.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Quotes{" "}
        </Button>
      </div>
    </div>
  );
};
