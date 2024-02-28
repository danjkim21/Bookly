import { Suspense } from "react";

import Loading from "@/app/loading";
import ReflectionList from "@/components/reflections/ReflectionList";
import { getReflections } from "@/lib/api/reflections/queries";
import { getBooks } from "@/lib/api/books/queries";
import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function ReflectionsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Reflections</h1>
        </div>
        <Reflections />
      </div>
    </main>
  );
}

const Reflections = async () => {
  await checkAuth();

  const { reflections } = await getReflections();
  const { books } = await getBooks();
  return (
    <Suspense fallback={<Loading />}>
      <ReflectionList reflections={reflections} books={books} />
    </Suspense>
  );
};
