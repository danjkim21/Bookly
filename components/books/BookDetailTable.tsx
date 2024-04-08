import { cn } from "@/lib/utils";

import { Separator } from "../ui/separator";
import {
  BookCopyIcon,
  BookOpenTextIcon,
  CalendarCheckIcon,
  CheckCircle2Icon,
  HeartIcon,
  StarsIcon,
  TagIcon,
  UserCircle2Icon
} from "lucide-react";
import { Book } from "@/lib/db/schema/books";

export default function BookDetailTable({
  optimisticBook,
  authorName,
  bookShelfTitle,
  subjects,
  rating,
  pageCount
}: {
  optimisticBook: Book;
  authorName: string;
  bookShelfTitle: string;
  subjects: string[];
  rating: number;
  pageCount: number;
}) {
  return (
    <div
      className={cn(
        "text-wrap",
        optimisticBook.id === "optimistic" ? "animate-pulse" : ""
      )}
    >
      <Separator className="my-6" />
      <section className="flex flex-row rounded-xl px-0 py-1 hover:bg-secondary md:px-3">
        <div className="flex items-center gap-2">
          <UserCircle2Icon className="h-4 w-4 text-accent" />
          <h2 className="min-w-36 text-accent">Author</h2>
        </div>
        <span>{authorName}</span>
      </section>
      <section className="flex flex-row rounded-xl px-0 py-1 hover:bg-secondary md:px-3">
        <div className="flex items-center gap-2">
          <BookCopyIcon className="h-4 w-4 text-accent" />
          <h2 className="min-w-36 text-accent">BookShelf</h2>
        </div>
        <span>{bookShelfTitle ? bookShelfTitle : "None"}</span>
      </section>
      <section className="flex flex-row rounded-xl px-0 py-1 hover:bg-secondary md:px-3">
        <div className="flex items-center gap-2">
          <HeartIcon className="h-4 w-4 text-accent" />
          <h2 className="min-w-36 text-accent">Favorited</h2>
        </div>
        <span>{optimisticBook.favorited ? "true" : "false"}</span>
      </section>
      <section className="flex flex-row rounded-xl px-0 py-1 hover:bg-secondary md:px-3">
        <div className="flex items-center gap-2">
          <CheckCircle2Icon className="h-4 w-4 text-accent" />
          <h2 className="min-w-36 text-accent">Completed</h2>
        </div>
        <span>{optimisticBook.completed ? "true" : "false"}</span>
      </section>
      <section className="flex flex-row rounded-xl px-0 py-1 hover:bg-secondary md:px-3">
        <div className="flex items-center gap-2">
          <CalendarCheckIcon className="h-4 w-4 text-accent" />
          <h2 className="min-w-36 text-accent">Completed On</h2>
        </div>
        <span>
          {optimisticBook.completedOn
            ? optimisticBook.completedOn
                .toString()
                .split(" ")
                .slice(0, 4)
                .join(" ")
            : "N/a"}
        </span>
      </section>

      <section className="flex flex-row rounded-xl px-0 py-1 hover:bg-secondary md:px-3">
        <div className="flex items-center gap-2">
          <BookOpenTextIcon className="h-4 w-4 text-accent" />
          <h2 className="min-w-36 text-accent">Page Count</h2>
        </div>
        <span>{pageCount ? pageCount : "N/a"}</span>
      </section>
      <section className="flex flex-row rounded-xl px-0 py-1 hover:bg-secondary md:px-3">
        <div className="flex items-center gap-2">
          <StarsIcon className="h-4 w-4 text-accent" />
          <h2 className="min-w-36 text-accent">Avg. Rating</h2>
        </div>
        <span>{rating ? rating : "N/a"}</span>
      </section>
      <section className="flex flex-row rounded-xl px-0 py-1 hover:bg-secondary md:px-3">
        <div className="flex items-start gap-2">
          <TagIcon className="h-4 w-4 text-accent" />
          <h2 className="min-w-36 text-accent">Subjects</h2>
        </div>
        <div className="line-clamp-2 flex flex-wrap gap-2">
          {subjects
            ? subjects.slice(0, 4).map((subject) => {
                return (
                  <span
                    className="overflow-hidden rounded-xl bg-neutral-100/50 object-cover px-2 py-1 text-sm dark:bg-neutral-800"
                    key={subject}
                  >
                    {subject}
                  </span>
                );
              })
            : "N/a"}
        </div>
      </section>
      <Separator className="my-6" />
    </div>
  );
}
