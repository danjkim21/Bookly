import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  QuoteId,
  NewQuoteParams,
  UpdateQuoteParams,
  updateQuoteSchema,
  insertQuoteSchema,
  quotes,
  quoteIdSchema,
} from "@/lib/db/schema/quotes";
import { getUserAuth } from "@/lib/auth/utils";

export const createQuote = async (quote: NewQuoteParams) => {
  const { session } = await getUserAuth();
  const newQuote = insertQuoteSchema.parse({
    ...quote,
    userId: session?.user.id!,
  });
  try {
    const [q] = await db.insert(quotes).values(newQuote).returning();
    return { quote: q };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateQuote = async (id: QuoteId, quote: UpdateQuoteParams) => {
  const { session } = await getUserAuth();
  const { id: quoteId } = quoteIdSchema.parse({ id });
  const newQuote = updateQuoteSchema.parse({
    ...quote,
    userId: session?.user.id!,
  });
  try {
    const [q] = await db
      .update(quotes)
      .set({ ...newQuote, updatedAt: new Date() })
      .where(and(eq(quotes.id, quoteId!), eq(quotes.userId, session?.user.id!)))
      .returning();
    return { quote: q };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteQuote = async (id: QuoteId) => {
  const { session } = await getUserAuth();
  const { id: quoteId } = quoteIdSchema.parse({ id });
  try {
    const [q] = await db
      .delete(quotes)
      .where(and(eq(quotes.id, quoteId!), eq(quotes.userId, session?.user.id!)))
      .returning();
    return { quote: q };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
