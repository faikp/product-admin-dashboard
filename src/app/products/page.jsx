"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getProducts,
  searchProducts,
  getCategories,
  getProductsByCategory,
} from "@/services/product";
import Link from "next/link";

export default function Products() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const initialPage = Number(searchParams.get("page"));
  const [page, setPage] = useState(
    Number.isInteger(initialPage) && initialPage > 0 ? initialPage : 1,
  );
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / limit);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "",
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "");

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    const controller = new AbortController();
    const skip = (page - 1) * limit;
    const timer = setTimeout(() => {
      async function loadProducts() {
        try {
          if (search.trim()) {
            const data = await searchProducts(search, controller.signal);

            setProducts(data.products);

            return;
          }

          const data = selectedCategory
            ? await getProductsByCategory(selectedCategory, limit, skip)
            : await getProducts(limit, skip);

          setProducts(data.products);
          setTotal(data.total);
        } catch (error) {
          if (error.code === "ERR_CANCELED") {
            return;
          }

          console.error("Failed to load products:", error);
        }
      }

      loadProducts();
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, page, limit, selectedCategory]);

  useEffect(() => {
    async function loadCategories() {
      const data = await getCategories();

      setCategories(data);
    }

    loadCategories();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();

    if (page !== 1) {
      params.set("page", page);
    }

    if (search) {
      params.set("search", search);
    }

    if (selectedCategory) {
      params.set("category", selectedCategory);
    }

    if (sortBy) {
      params.set("sort", sortBy);
    }

    const queryString = params.toString();

    router.replace(queryString ? `/products?${queryString}` : "/products");
  }, [page, search, selectedCategory, sortBy, router]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.replace("/login");
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price") {
      return a.price - b.price;
    }

    if (sortBy === "rating") {
      return b.rating - a.rating;
    }

    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }

    return 0;
  });

  return (
    <main className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-center text-3xl font-bold text-gray-900 sm:text-left">
          Products
        </h1>

        <button
          type="button"
          onClick={() => router.push("/products/add")}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Add Product
        </button>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="mb-6 max-w-xl">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6 max-w-xl">
        <select
          value={selectedCategory}
          onChange={(event) => {
            setSelectedCategory(event.target.value);
            setPage(1);
          }}
          className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6 max-w-xl">
        <select
          value={sortBy}
          onChange={(event) => {
            setSortBy(event.target.value);
            setPage(1);
          }}
          className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sort By</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div className="hidden overflow-x-auto rounded-xl border bg-white shadow-sm md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-3 text-left">Image</th>
              <th className="border p-3 text-left">Title</th>
              <th className="border p-3 text-left">Category</th>
              <th className="border p-3 text-left">Price</th>
              <th className="border p-3 text-left">Rating</th>
              <th className="border p-3 text-left">Stock</th>
            </tr>
          </thead>

          <tbody>
            {sortedProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="border p-3">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                </td>

                <td className="border p-3">
                  <Link
                    href={`/products/${product.id}`}
                    className="font-medium hover:underline"
                  >
                    {product.title}
                  </Link>
                </td>

                <td className="border p-3">{product.category}</td>

                <td className="border p-3">${product.price}</td>

                <td className="border p-3">⭐ {product.rating}</td>

                <td className="border p-3">{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-4 md:hidden">
        {sortedProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-xl border bg-white p-4 shadow-sm"
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              className="mb-3 h-48 w-full rounded-lg object-cover"
              loading="lazy"
            />

            <h2 className="text-lg font-semibold text-gray-900">
              <Link
                href={`/products/${product.id}`}
                className="font-medium hover:underline"
              >
                {product.title}
              </Link>
            </h2>

            <p className="mt-1 text-sm text-gray-500">{product.category}</p>

            <div className="mt-3 space-y-1 text-sm">
              <p className="font-medium">Price: ${product.price}</p>
              <p>Rating: ⭐ {product.rating}</p>
              <p>Stock: {product.stock}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-end gap-2">
        <label htmlFor="page-size" className="text-sm text-gray-600">
          Products per page:
        </label>

        <select
          id="page-size"
          value={limit}
          onChange={(event) => {
            setLimit(Number(event.target.value));
            setPage(1);
          }}
          className="rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>

      <p className="mt-6 text-center text-sm text-gray-600">
        Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of{" "}
        {total}
      </p>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() => setPage((currentPage) => currentPage - 1)}
          disabled={page === 1}
          className="rounded-lg border bg-white px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`rounded-lg px-3 py-2 ${
                  page === pageNumber
                    ? "bg-blue-600 text-white"
                    : "border bg-white"
                }`}
              >
                {pageNumber}
              </button>
            ),
          )}
        </div>

        <button
          onClick={() => setPage((currentPage) => currentPage + 1)}
          disabled={page >= Math.ceil(total / limit)}
          className="rounded-lg border bg-white px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
}
