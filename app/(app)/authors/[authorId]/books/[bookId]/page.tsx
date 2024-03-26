import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getBookByIdWithQuotesAndReflectionsAndReviews } from "@/lib/api/books/queries";
import { getAuthors } from "@/lib/api/authors/queries";
import OptimisticBook from "@/app/(app)/books/[bookId]/OptimisticBook";
import { checkAuth } from "@/lib/auth/utils";
import QuoteList from "@/components/quotes/QuoteList";
import ReflectionList from "@/components/reflections/ReflectionList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";
import { getBookShelves } from "@/lib/api/bookShelves/queries";
import { Separator } from "@/components/ui/separator";
import StarIcon from "@/components/shared/StarIcon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

  const { book, quotes, reflections, review, user } =
    await getBookByIdWithQuotesAndReflectionsAndReviews(id);
  const { authors } = await getAuthors();
  const { bookShelves } = await getBookShelves();

  if (!book) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="books" />
        <OptimisticBook
          book={book}
          authors={authors}
          authorId={book.authorId}
          bookShelves={bookShelves}
          bookShelfId={book?.bookShelfId!}
        />
      </div>

      <div className="relative mx-4 mt-8">
        {review ? (
          <div className="flex gap-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="border-2 border-border text-muted-foreground">
                {user?.name
                  ? user?.name
                      ?.split(" ")
                      .map((word) => word[0].toUpperCase())
                      .join("")
                  : "~"}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center">
                <StarIcon />
                <p className="ms-2 text-sm font-semibold text-muted-foreground">
                  <span className="">{review.rating}</span> out of 5
                </p>
              </div>
              <blockquote className="text-background-foreground text-left font-normal italic dark:text-white">
                <p className='before:content-["\""] after:content-["\""]'>
                  {review.content}
                </p>
              </blockquote>
            </div>
          </div>
        ) : (
          <h3>No Review</h3>
        )}
        <Separator className="mt-6" />
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
