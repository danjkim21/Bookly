import { Suspense } from "react";

import Loading from "@/app/loading";
import QuoteList from "@/components/quotes/QuoteList";
import { getQuotes } from "@/lib/api/quotes/queries";
import { getBooks } from "@/lib/api/books/queries";
import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function QuotesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Quotes</h1>
        </div>
        <Quotes />
      </div>
    </main>
  );
}

const Quotes = async () => {
  await checkAuth();

  const { quotes } = await getQuotes();
  const { books } = await getBooks();
  return (
    <Suspense fallback={<Loading />}>
      <QuoteList quotes={quotes} books={books} />
    </Suspense>
  );
};
