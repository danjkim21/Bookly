import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getBookShelfByIdWithBooksAndComments } from "@/lib/api/bookShelves/queries";
import OptimisticBookShelf from "./OptimisticBookShelf";
import { checkAuth } from "@/lib/auth/utils";
import CommentList from "@/components/comments/CommentList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";
import BookList from "@/components/books/BookList";
import { getAuthors } from "@/lib/api/authors/queries";

export const revalidate = 0;

export default async function BookShelfPage({
  params
}: {
  params: { bookShelfId: string };
}) {
  return (
    <main className="overflow-auto">
      <BookShelf id={params.bookShelfId} />
    </main>
  );
}

const BookShelf = async ({ id }: { id: string }) => {
  await checkAuth();

  const { bookShelf, books, comments } =
    await getBookShelfByIdWithBooksAndComments(id);
  const { authors } = await getAuthors();

  if (!bookShelf) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="book-shelves" />
        <OptimisticBookShelf bookShelf={bookShelf} />
      </div>
      <div className="relative mx-4 mt-8">
        <h3 className="mb-4 text-xl font-medium">Books</h3>
        <BookList authors={authors} books={books} />
      </div>
      <div className="relative mx-4 mt-8">
        <h3 className="mb-4 text-xl font-medium">Comments</h3>
        <CommentList
          bookShelves={[]}
          bookShelfId={bookShelf.id}
          comments={comments}
        />
      </div>
    </Suspense>
  );
};
