import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle
} from "@/components/ui/card";
import Link from "next/link";
import StatisticItem from "./StatisticItem";
import { getMostRecentBookShelves } from "@/lib/api/bookShelves/queries";
import { BookCopyIcon } from "lucide-react";

export default async function RecentBookShelves() {
  const { bookShelves } = await getMostRecentBookShelves();

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">Latest Bookshelves</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* Empty State */}
        {bookShelves.length === 0 && (
          // TODO: replace link with popup create shelf component
          <Link href="/book-shelves">
            <Card className="col-span-1 flex h-[150px] items-center justify-center rounded-md border border-dashed border-white text-sm hover:border-transparent hover:shadow-sm">
              <BookCopyIcon className="h-6 w-6" />
              <CardContent className="p-4">
                <CardTitle className="font-md text-base">
                  No bookshelves found
                </CardTitle>
                <CardDescription>Add a new bookshelf</CardDescription>
              </CardContent>
            </Card>
          </Link>
        )}

        {/* BookShelf List */}
        {bookShelves.map((bookShelf) => {
          return (
            <Card key={bookShelf.id} className="col-span-1">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="h-16 w-12 overflow-hidden rounded-xl bg-neutral-100/50 object-cover dark:bg-neutral-800">
                    {/* TODO: Create book.url property in schema and add url img instead of this placeholder */}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Link href={`/${bookShelf.slug}`} className="line-clamp-1">
                      <CardTitle className="text-md font-medium underline-offset-4 hover:underline">
                        {bookShelf.title}
                      </CardTitle>
                    </Link>
                    <div>
                      {bookShelf.public ? (
                        <span className="inline-flex gap-1 rounded-md bg-green-800/30 px-2 py-[1px] text-sm text-green-500">
                          Public
                        </span>
                      ) : (
                        <span className="inline-flex gap-1 rounded-md bg-gray-800/30 px-2 py-[1px] text-sm text-gray-300">
                          Private
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="grid grid-cols-2 gap-2 rounded-b-lg border bg-muted p-4 dark:bg-card">
                <StatisticItem
                  label="Total Books"
                  value={bookShelf.bookCount ? bookShelf.bookCount : 0}
                />
                <StatisticItem
                  label="Total Comments"
                  value={bookShelf.commentCount ? bookShelf.commentCount : 0}
                />
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
