import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getAuthorByIdWithBooks } from "@/lib/api/authors/queries";
import OptimisticAuthor from "./OptimisticAuthor";
import { checkAuth } from "@/lib/auth/utils";
import BookList from "@/components/books/BookList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";

export const revalidate = 0;

export default async function AuthorPage({
  params
}: {
  params: { authorId: string };
}) {
  return (
    <main className="overflow-auto">
      <Author id={params.authorId} />
    </main>
  );
}

const Author = async ({ id }: { id: string }) => {
  await checkAuth();

  const { author, books } = await getAuthorByIdWithBooks(id);

  if (!author) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="authors" />
        <OptimisticAuthor author={author} />
      </div>
      <div className="relative mx-4 mt-8">
        <h3 className="mb-4 text-xl font-medium">{author.name}&apos;s Books</h3>
        <BookList authors={[]} authorId={author.id} books={books} />
      </div>
    </Suspense>
  );
};
