import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createBook, deleteBook, updateBook } from "@/lib/api/books/mutations";
import {
  bookIdSchema,
  insertBookParams,
  updateBookParams
} from "@/lib/db/schema/books";

export async function POST(req: Request) {
  try {
    const validatedData = insertBookParams.parse(await req.json());
    const { book } = await createBook(validatedData);

    revalidatePath("/books"); // optional - assumes you will have named route same as entity

    return NextResponse.json(book, { status: 201 });
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

    const validatedData = updateBookParams.parse(await req.json());
    const validatedParams = bookIdSchema.parse({ id });

    const { book } = await updateBook(validatedParams.id, validatedData);

    return NextResponse.json(book, { status: 200 });
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

    const validatedParams = bookIdSchema.parse({ id });
    const { book } = await deleteBook(validatedParams.id);

    return NextResponse.json(book, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
