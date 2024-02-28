import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getBookShelfByIdWithComments } from "@/lib/api/bookShelves/queries";
import OptimisticBookShelf from "./OptimisticBookShelf";
import { checkAuth } from "@/lib/auth/utils";
import CommentList from "@/components/comments/CommentList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";

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

  const { bookShelf, comments } = await getBookShelfByIdWithComments(id);

  if (!bookShelf) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="book-shelves" />
        <OptimisticBookShelf bookShelf={bookShelf} />
      </div>
      <div className="relative mx-4 mt-8">
        <h3 className="mb-4 text-xl font-medium">
          {bookShelf.title}&apos;s Comments
        </h3>
        <CommentList
          bookShelves={[]}
          bookShelfId={bookShelf.id}
          comments={comments}
        />
      </div>
    </Suspense>
  );
};
