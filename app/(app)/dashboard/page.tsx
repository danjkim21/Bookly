import { getUserAuth } from "@/lib/auth/utils";
import SummaryItems from "./SummaryItems";
import {
  getBookCounts,
  getQuoteCounts,
  getReflectionCounts,
  getReviewCounts
} from "@/lib/api/statistics/queries";
import RecentItems from "./RecentItems";
import RecentBookShelves from "./RecentBookShelves";

export default async function Home() {
  const { session } = await getUserAuth();
  const { total, completed, favorited } = await getBookCounts();
  const { total: totalReviews } = await getReviewCounts();
  const { total: totalQuotes } = await getQuoteCounts();
  const { total: totalReflections } = await getReflectionCounts();

  return (
    <section className="flex flex-col gap-6 px-0 py-6 md:px-4">
      <h1 className="my-2 text-2xl font-bold text-accent">
        Welcome, <span className="text-white">{session?.user.name}</span>
      </h1>

      <SummaryItems
        totalCount={total.count}
        completedCount={completed.count}
        favoritedCount={favorited.count}
        totalReviews={totalReviews.count}
        totalQuotes={totalQuotes.count}
        totalReflections={totalReflections.count}
      />

      <RecentItems />
      <RecentBookShelves />
    </section>
  );
}
