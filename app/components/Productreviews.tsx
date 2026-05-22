"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Star, StarOff, Trash2, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductReviews({ productId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [productRating, setProductRating] = useState(0);
  const [numReviews, setNumReviews] = useState(0);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews || []);
        setProductRating(data.rating || 0);
        setNumReviews(data.numReviews || 0);

        if (user) {
          const userReview = data.reviews?.find((r) => r.userId === user.id);
          setHasReviewed(!!userReview);
        }
      }
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Please log in to leave a review.");
      return;
    }

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });

      const data = await res.json();
      if (res.ok) {
        setReviews([data.review, ...reviews]);
        setProductRating(data.rating);
        setNumReviews(data.numReviews);
        setRating(0);
        setComment("");
        setHasReviewed(true);
      } else {
        setError(data.error || "Failed to submit review.");
      }
    } catch (err) {
      setError("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!confirm("Are you sure you want to delete your review?")) return;

    try {
      const res = await fetch(`/api/reviews?productId=${productId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setReviews(reviews.filter((r) => r.userId !== user.id));
        setProductRating(data.rating);
        setNumReviews(data.numReviews);
        setHasReviewed(false);
      }
    } catch (err) {
      console.log("Failed to delete review", err);
    }
  };

  const renderStars = (rating, interactive = false, size = "w-5 h-5") => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = interactive
            ? star <= (hoverRating || rating)
            : star <= rating;

          return (
            <button
              key={star}
              type="button"
              onClick={interactive ? () => setRating(star) : undefined}
              onMouseEnter={
                interactive ? () => setHoverRating(star) : undefined
              }
              onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
              disabled={!interactive}
              className={`${interactive ? "cursor-pointer hover:scale-110" : ""} transition-transform`}
            >
              {filled ? (
                <Star className={`${size} fill-yellow-400 text-yellow-400`} />
              ) : (
                <Star className={`${size} text-gray-300`} />
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-8 p-6 bg-gray-50 rounded-2xl">
        <div className="text-center">
          <p className="text-5xl font-bold text-gray-900">
            {productRating.toFixed(1)}
          </p>
          <div className="flex justify-center mt-2">
            {renderStars(Math.round(productRating))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {numReviews} {numReviews === 1 ? "review" : "reviews"}
          </p>
        </div>

        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const percentage = numReviews > 0 ? (count / numReviews) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-3 mb-2">
                <span className="text-sm text-gray-600 w-8">{star} ★</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {user && !hasReviewed ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-xl font-bold mb-4">Write a Review</h3>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating *
              </label>
              {renderStars(rating, true, "w-8 h-8")}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || rating === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </div>
      ) : !user ? (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
          <p className="text-blue-900 font-medium">
            Please log in to write a review
          </p>
        </div>
      ) : hasReviewed ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
          <p className="text-green-900 font-medium">
            Thank you for your review!
          </p>
          <button
            onClick={handleDeleteReview}
            className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Delete my review
          </button>
        </div>
      ) : null}

      <div className="space-y-6">
        <h3 className="text-xl font-bold">Customer Reviews</h3>

        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <p className="text-gray-500">
              No reviews yet. Be the first to review!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {review.userName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  {user?.id === review.userId && (
                    <button
                      onClick={handleDeleteReview}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                    </button>
                  )}
                </div>

                {renderStars(review.rating)}

                {review.comment && (
                  <p className="mt-3 text-gray-700">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
