import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import StatisticItem from "./StatisticItem";
import { getMostRecentBooks } from "@/lib/api/books/queries";

export default async function RecentItems() {
  const { books } = await getMostRecentBooks();

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">Recently Added</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {books.map((book) => {
          return (
            <Card key={book.id} className="col-span-1">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="h-16 min-w-12 overflow-hidden rounded-xl bg-neutral-100/50 object-cover dark:bg-neutral-800">
                    {/* TODO: Create book.url property in schema and add url img instead of this placeholder */}
                  </div>
                  <div className="flex flex-col">
                    <Link href={`/books/${book.id}`} className="line-clamp-1">
                      <h3 className="text-md font-medium underline-offset-4 hover:underline">
                        {book.title}
                      </h3>
                    </Link>
                    <Link
                      href={`/authors/${book.author?.id}`}
                      className="text-sm text-muted-foreground underline-offset-2 hover:underline"
                    >
                      {book.author?.name}
                    </Link>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="grid grid-cols-2 gap-2 rounded-b-lg border bg-muted p-4 dark:bg-card">
                <StatisticItem label="Date Added" value={book.createdAt} />
                <StatisticItem label="Total Pages" value={0} />
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
