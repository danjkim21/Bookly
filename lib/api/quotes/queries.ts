import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type QuoteId, quoteIdSchema, quotes } from "@/lib/db/schema/quotes";
import { books } from "@/lib/db/schema/books";

export const getQuotes = async () => {
  const { session } = await getUserAuth();
  const rows = await db
    .select({ quote: quotes, book: books })
    .from(quotes)
    .leftJoin(books, eq(quotes.bookId, books.id))
    .where(eq(quotes.userId, session?.user.id!));
  const q = rows.map((r) => ({ ...r.quote, book: r.book }));
  return { quotes: q };
};

export const getQuoteById = async (id: QuoteId) => {
  const { session } = await getUserAuth();
  const { id: quoteId } = quoteIdSchema.parse({ id });
  const [row] = await db
    .select({ quote: quotes, book: books })
    .from(quotes)
    .where(and(eq(quotes.id, quoteId), eq(quotes.userId, session?.user.id!)))
    .leftJoin(books, eq(quotes.bookId, books.id));
  if (row === undefined) return {};
  const q = { ...row.quote, book: row.book };
  return { quote: q };
};
