import Search from "@/components/Search";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getUserAuth } from "@/lib/auth/utils";
import StatisticItem from "./StatisticItem";
import Link from "next/link";

export default async function Home() {
  const { session } = await getUserAuth();
  return (
    <section className="flex flex-col gap-6 px-0 py-6 md:px-4">
      <h1 className="my-0 my-2 text-2xl font-bold text-accent">
        Welcome, <span className="text-white">{session?.user.name}</span>
      </h1>

      <Search />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card className="col-span-1">
          <CardContent className="p-4">
            <div className="grid grid-cols-2">
              <StatisticItem label="books completed" value={39} />
              <StatisticItem label="pages read" value={48001} />
            </div>
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-2 rounded-b-lg border bg-muted p-4 dark:bg-card">
            <Button>Add</Button>
            <Button>Complete</Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardContent className="flex flex-col gap-6 p-4">
            <div className="grid grid-cols-2">
              <StatisticItem label="books favorited" value={12} />
              <StatisticItem label="books reviewed" value={1} />
            </div>
            <div className="grid grid-cols-2">
              <StatisticItem label="quotes captured" value={19} />
              <StatisticItem label="reflections added" value={48} />
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="flex flex-col gap-2">
        <h2>Recently Added</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Card className="col-span-1">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="h-16 w-12 overflow-hidden rounded-xl bg-neutral-100/50 object-cover dark:bg-neutral-800">
                  {/* TODO: Create book.url property in schema and add url img instead of this placeholder */}
                </div>
                <div className="flex flex-col gap-1">
                  {/* TODO: link bookIds */}
                  <Link href={`/book/${"bookId"}`}>Book Title</Link>
                  <div>
                    <span className="inline-flex gap-1 rounded-md bg-green-800/30 px-2 py-[1px] text-sm text-green-500">
                      <span>Author Name</span>
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-2 rounded-b-lg border bg-muted p-4 dark:bg-card">
              <StatisticItem label="Date Added" value={19} />
              <StatisticItem label="Total Pages" value={48} />
            </CardFooter>
          </Card>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2>Latest Bookshelves</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Card className="col-span-1">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="h-16 w-12 overflow-hidden rounded-xl bg-neutral-100/50 object-cover dark:bg-neutral-800">
                  {/* TODO: Create book.url property in schema and add url img instead of this placeholder */}
                </div>
                <div className="flex flex-col gap-1">
                  {/* TODO: link bookIds */}
                  <Link href={`/${"shelfSlug"}`}>Book Shelf Name</Link>
                  <div>
                    <span className="inline-flex gap-1 rounded-md bg-green-800/30 px-2 py-[1px] text-sm text-green-500">
                      <span>Public</span>
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-2 rounded-b-lg border bg-muted p-4 dark:bg-card">
              <StatisticItem label="Total Books" value={5} />
              <StatisticItem label="Total Comments" value={418} />
            </CardFooter>
          </Card>
        </div>
      </section>
    </section>
  );
}
