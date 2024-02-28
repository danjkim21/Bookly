import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createQuote,
  deleteQuote,
  updateQuote
} from "@/lib/api/quotes/mutations";
import {
  quoteIdSchema,
  insertQuoteParams,
  updateQuoteParams
} from "@/lib/db/schema/quotes";

export async function POST(req: Request) {
  try {
    const validatedData = insertQuoteParams.parse(await req.json());
    const { quote } = await createQuote(validatedData);

    revalidatePath("/quotes"); // optional - assumes you will have named route same as entity

    return NextResponse.json(quote, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedData = updateQuoteParams.parse(await req.json());
    const validatedParams = quoteIdSchema.parse({ id });

    const { quote } = await updateQuote(validatedParams.id, validatedData);

    return NextResponse.json(quote, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedParams = quoteIdSchema.parse({ id });
    const { quote } = await deleteQuote(validatedParams.id);

    return NextResponse.json(quote, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
