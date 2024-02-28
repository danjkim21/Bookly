import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getQuoteById } from "@/lib/api/quotes/queries";
import { getBooks } from "@/lib/api/books/queries";
import OptimisticQuote from "@/app/(app)/quotes/[quoteId]/OptimisticQuote";
import { checkAuth } from "@/lib/auth/utils";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";

export const revalidate = 0;

export default async function QuotePage({
  params,
}: {
  params: { quoteId: string };
}) {
  return (
    <main className="overflow-auto">
      <Quote id={params.quoteId} />
    </main>
  );
}

const Quote = async ({ id }: { id: string }) => {
  await checkAuth();

  const { quote } = await getQuoteById(id);
  const { books } = await getBooks();

  if (!quote) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="quotes" />
        <OptimisticQuote quote={quote} books={books} />
      </div>
    </Suspense>
  );
};
