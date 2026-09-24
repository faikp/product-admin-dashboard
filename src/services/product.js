import api from "@/lib/axios";

export async function getProducts(limit, skip) {
  const response = await api.get("/products", {
    params: {
      limit,
      skip,
    },
  });

  return response.data;
}

export async function searchProducts(query, signal) {
    const response = await api.get("/products/search",{
        params: {
            q: query,
        },
        signal,
    });

    return response.data
}