"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getProductById } from "@/services/product";

export default function ProductDetails() {
  const params = useParams();

  const id = params.id;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return <p className="p-6">Loading product...</p>;
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Product not found
          </h1>

          <p className="mt-2 text-gray-600">
            The product you are looking for does not exist.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[...new Set(product.images)].map((image) => (
            <img
              key={image}
              src={image}
              alt={product.title}
              className="h-48 w-full rounded-lg object-cover"
            />
          ))}
        </div>

        <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>

        <p className="mt-2 text-gray-500">{product.category}</p>

        <p className="mt-4 text-2xl font-bold">${product.price}</p>

        <p className="mt-4 text-gray-700">{product.description}</p>

        <p className="mt-4">Rating: ⭐ {product.rating}</p>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>

          <div className="mt-4 space-y-4">
            {product.reviews.map((review) => (
              <div
                key={`${review.reviewerEmail}-${review.rating}-${review.comment}`}
                className="rounded-lg border p-4"
              >
                <p className="font-semibold text-gray-900">
                  {review.reviewerName}
                </p>

                <p className="mt-1">⭐ {review.rating}</p>

                <p className="mt-2 text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
