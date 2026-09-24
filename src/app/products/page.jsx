"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProducts, searchProducts } from "@/services/product";

export default function Products() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      async function loadProducts() {
        try {
          if (search.trim()) {
            const data = await searchProducts(search, controller.signal);

            setProducts(data.products);

            return;
          }

          const data = await getProducts();

          setProducts(data.products);
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
  }, [search]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.replace("/login");
  };

  return (
    <main className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-center text-3xl font-bold text-gray-900 sm:text-left">
          Products
        </h1>

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
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="border p-3">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                </td>

                <td className="border p-3">{product.title}</td>

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
        {products.map((product) => (
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
              {product.title}
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
    </main>
  );
}
