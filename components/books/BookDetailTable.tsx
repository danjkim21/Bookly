import { cn } from "@/lib/utils";

import { Separator } from "../ui/separator";
import {
  BookCopyIcon,
  CalendarCheckIcon,
  CheckCircle2Icon,
  HeartIcon,
  UserCircle2Icon
} from "lucide-react";
import { Book } from "@/lib/db/schema/books";

export default function BookDetailTable({
  optimisticBook,
  authorName,
  bookShelfTitle
}: {
  optimisticBook: Book;
  authorName: string;
  bookShelfTitle: string;
}) {
  return (
    <div
      className={cn(
        "text-wrap",
        optimisticBook.id === "optimistic" ? "animate-pulse" : ""
      )}
    >
      <Separator className="my-6" />
      <section className="flex flex-row rounded-xl px-3 py-1 hover:bg-secondary">
        <div className="flex items-center gap-2">
          <UserCircle2Icon className="h-4 w-4 text-accent" />
          <h2 className="min-w-36 text-accent">Author</h2>
        </div>
        <span>{authorName}</span>
      </section>
      <section className="flex flex-row rounded-xl px-3 py-1 hover:bg-secondary">
        <div className="flex items-center gap-2">
          <BookCopyIcon className="h-4 w-4 text-accent" />
          <h2 className="min-w-36 text-accent">BookShelf</h2>
        </div>
        <span>{bookShelfTitle}</span>
      </section>
      <section className="flex flex-row rounded-xl px-3 py-1 hover:bg-secondary">
        <div className="flex items-center gap-2">
          <HeartIcon className="h-4 w-4 text-accent" />
          <h2 className="min-w-36 text-accent">Favorited</h2>
        </div>
        <span>{optimisticBook.favorited ? "true" : "false"}</span>
      </section>
      <section className="flex flex-row rounded-xl px-3 py-1 hover:bg-secondary">
        <div className="flex items-center gap-2">
          <CheckCircle2Icon className="h-4 w-4 text-accent" />
          <h2 className="min-w-36 text-accent">Completed</h2>
        </div>
        <span>{optimisticBook.completed ? "true" : "false"}</span>
      </section>
      <section className="flex flex-row rounded-xl px-3 py-1 hover:bg-secondary">
        <div className="flex items-center gap-2">
          <CalendarCheckIcon className="h-4 w-4 text-accent" />
          <h2 className="min-w-36 text-accent">Completed On</h2>
        </div>
        <span>
          {optimisticBook.completedOn
            ? optimisticBook.completedOn?.toDateString()
            : "N/a"}
        </span>
      </section>
      <Separator className="my-6" />
    </div>
  );
}
