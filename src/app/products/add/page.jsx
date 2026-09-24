"use client";

import { useState } from "react";
import { addProduct } from "@/services/product";

export default function AddProduct() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    if (!title || !price || !category || !description) {
      alert("Please fill in all fields.");
      return;
    }

    const numericPrice = Number(price);

    if (numericPrice <= 0 || Number.isNaN(numericPrice)) {
      alert("Price must be greater than 0.");
      return;
    }

    if (saving) {
      return;
    }

    setSaving(true);

    try {
      const data = await addProduct({
        title,
        price: numericPrice,
        category,
        description,
      });

      console.log(data);
      setSuccess("Product added successfully.");
      setTitle("");
      setPrice("");
      setCategory("");
      setDescription("");
    } catch (error) {
      console.error("Failed to add product:", error);
    } finally {
      setSaving(false);
    }
  };
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Add Product</h1>

        <div className="mt-6">
          <label
            htmlFor="title"
            className="mb-2 block font-medium text-gray-700"
          >
            Product Title
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter product title"
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mt-6">
          <label
            htmlFor="price"
            className="mb-2 block font-medium text-gray-700"
          >
            Price
          </label>

          <input
            id="price"
            type="number"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="Enter product price"
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mt-6">
          <label
            htmlFor="category"
            className="mb-2 block font-medium text-gray-700"
          >
            Category
          </label>

          <input
            id="category"
            type="text"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Enter product category"
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mt-6">
          <label
            htmlFor="description"
            className="mb-2 block font-medium text-gray-700"
          >
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Enter product description"
            rows={5}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {success && (
          <p className="mt-4 text-sm font-medium text-green-600">{success}</p>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Product"}
        </button>
      </div>
    </main>
  );
}
