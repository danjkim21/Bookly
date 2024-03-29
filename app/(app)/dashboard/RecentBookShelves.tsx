import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import StatisticItem from "./StatisticItem";
import { getMostRecentBookShelves } from "@/lib/api/bookShelves/queries";

export default async function RecentBookShelves() {
  const { bookShelves } = await getMostRecentBookShelves();

  return (
    <section className="flex flex-col gap-2">
      <h2>Latest Bookshelves</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {bookShelves.map((bookShelf) => {
          return (
            <Card key={bookShelf.id} className="col-span-1">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="h-16 w-12 overflow-hidden rounded-xl bg-neutral-100/50 object-cover dark:bg-neutral-800">
                    {/* TODO: Create book.url property in schema and add url img instead of this placeholder */}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Link href={`/${bookShelf.slug}`}>{bookShelf.title}</Link>
                    <div>
                      {bookShelf.public ? (
                        <span className="inline-flex gap-1 rounded-md bg-green-800/30 px-2 py-[1px] text-sm text-green-500">
                          <span>Public</span>
                        </span>
                      ) : (
                        <span className="inline-flex gap-1 rounded-md bg-gray-800/30 px-2 py-[1px] text-sm text-gray-300">
                          <span>Private</span>
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
                <StatisticItem label="Total Comments" value={0} />
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
