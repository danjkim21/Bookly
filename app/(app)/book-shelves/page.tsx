import { Suspense } from "react";

import Loading from "@/app/loading";
import BookShelfList from "@/components/bookShelves/BookShelfList";
import { getBookShelves } from "@/lib/api/bookShelves/queries";

import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function BookShelvesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="my-2 text-2xl font-semibold">Book Shelves</h1>
        </div>
        <BookShelves />
      </div>
    </main>
  );
}

const BookShelves = async () => {
  await checkAuth();

  const { bookShelves } = await getBookShelves();

  return (
    <Suspense fallback={<Loading />}>
      <BookShelfList bookShelves={bookShelves} />
    </Suspense>
  );
};
