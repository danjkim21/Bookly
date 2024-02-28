import { Suspense } from "react";

import Loading from "@/app/loading";
import AuthorList from "@/components/authors/AuthorList";
import { getAuthors } from "@/lib/api/authors/queries";

import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function AuthorsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="my-2 text-2xl font-semibold">Authors</h1>
        </div>
        <Authors />
      </div>
    </main>
  );
}

const Authors = async () => {
  await checkAuth();

  const { authors } = await getAuthors();

  return (
    <Suspense fallback={<Loading />}>
      <AuthorList authors={authors} />
    </Suspense>
  );
};
