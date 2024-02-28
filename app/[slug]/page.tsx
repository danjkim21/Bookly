import { notFound } from "next/navigation";

import { getBookShelfBySlugWithBooksAndComments } from "@/lib/api/bookShelves/queries";
import { BookIcon } from "lucide-react";

export default async function Page({ params }: { params: { slug: string } }) {
  const { bookShelf, books } = await getBookShelfBySlugWithBooksAndComments(
    params.slug
  );

  console.log(bookShelf);

  if (!bookShelf) notFound();
  if (bookShelf.public === false) return <main>This page is not public.</main>;

  return (
    <main>
      <div className="flex h-screen flex-col items-center justify-center bg-[#679572] px-4 py-8 text-center">
        <header className="mb-10">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-gray-300" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">
            {bookShelf.title}
          </h1>
          <p className="text-white">{bookShelf.description}</p>
        </header>
        <section className="flex w-full max-w-md flex-1 flex-col gap-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="flex items-center gap-4 rounded-lg border border-gray-300 bg-white p-4 transition-all duration-300 hover:bg-gray-200"
            >
              <BookIcon className="h-5 w-5 text-gray-500" />
              <span className="text-gray-800">{book.title}</span>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
