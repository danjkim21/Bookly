import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getBookByIdWithQuotesAndReflections } from "@/lib/api/books/queries";
import { getAuthors } from "@/lib/api/authors/queries";
import OptimisticBook from "@/app/(app)/books/[bookId]/OptimisticBook";
import { checkAuth } from "@/lib/auth/utils";
import QuoteList from "@/components/quotes/QuoteList";
import ReflectionList from "@/components/reflections/ReflectionList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";

export const revalidate = 0;

export default async function BookPage({
  params
}: {
  params: { bookId: string };
}) {
  return (
    <main className="overflow-auto">
      <Book id={params.bookId} />
    </main>
  );
}

const Book = async ({ id }: { id: string }) => {
  await checkAuth();

  const { book, quotes, reflections } =
    await getBookByIdWithQuotesAndReflections(id);
  const { authors } = await getAuthors();

  if (!book) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="books" />
        <OptimisticBook book={book} authors={authors} />
      </div>
      <div className="relative mx-4 mt-8">
        <h3 className="mb-4 text-xl font-medium">{book.title}&apos;s Quotes</h3>
        <QuoteList books={[]} bookId={book.id} quotes={quotes} />
      </div>
      <div className="relative mx-4 mt-8">
        <h3 className="mb-4 text-xl font-medium">
          {book.title}&apos;s Reflections
        </h3>
        <ReflectionList books={[]} bookId={book.id} reflections={reflections} />
      </div>
    </Suspense>
  );
};
