import { Suspense } from "react";

import Loading from "@/app/loading";
import BookList from "@/components/books/BookList";
import { getBooks } from "@/lib/api/books/queries";
import { getAuthors } from "@/lib/api/authors/queries";
import { checkAuth } from "@/lib/auth/utils";
import { getBookShelves } from "@/lib/api/bookShelves/queries";

export const revalidate = 0;

export default async function BooksPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="my-2 text-2xl font-semibold">Books</h1>
        </div>
        <Books />
      </div>
    </main>
  );
}

const Books = async () => {
  await checkAuth();

  const { books } = await getBooks();
  const { authors } = await getAuthors();
  const { bookShelves } = await getBookShelves();

  return (
    <Suspense fallback={<Loading />}>
      <BookList books={books} authors={authors} bookShelves={bookShelves} />
    </Suspense>
  );
};
