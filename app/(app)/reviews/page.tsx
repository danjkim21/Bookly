import { Suspense } from "react";

import Loading from "@/app/loading";
import ReviewList from "@/components/reviews/ReviewList";
import { getReviews } from "@/lib/api/reviews/queries";
import { getBooks } from "@/lib/api/books/queries";
import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function ReviewsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="my-2 text-2xl font-semibold">Reviews</h1>
        </div>
        <Reviews />
      </div>
    </main>
  );
}

const Reviews = async () => {
  await checkAuth();

  const { reviews } = await getReviews();
  const { books } = await getBooks();
  return (
    <Suspense fallback={<Loading />}>
      <ReviewList reviews={reviews} books={books} />
    </Suspense>
  );
};
