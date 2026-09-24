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
    const response = await api.get("/products/search", {
        params: {
            q: query,
        },
        signal,
    });

    return response.data
}

export async function getCategories() {
    const response = await api.get("/products/categories");

    return response.data;
}

export async function getProductsByCategory(category, limit, skip) {
    const response = await api.get(`/products/category/${category}`, {
        params: {
            limit,
            skip,
        },
    });

    return response.data;
}

export async function getProductById(id) {
    const response = await api.get(`/products/${id}`);

    return response.data;
}

export async function addProduct(productData) {
    const response = await api.post("/products/add", productData);

    return response.data;
}