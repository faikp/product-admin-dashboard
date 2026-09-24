import api from "@/lib/axios";

export async function getProducts() {
    const response = await api.get("/products");

    return response.data
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