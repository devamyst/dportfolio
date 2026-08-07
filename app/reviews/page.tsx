import { listReviews } from "@/lib/db";
import ReviewsSection from "@/components/ReviewsSection";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviews = await listReviews();
  return (
    <div className="pt-16">
      <ReviewsSection initialReviews={reviews} />
    </div>
  );
}
