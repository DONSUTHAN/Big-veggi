import api from "./api.js";

export const productService = {
  async list(params = {}) {
    const { data } = await api.get("/products", { params });
    return data;
  },

  async mine() {
    const { data } = await api.get("/products/mine");
    return data;
  },

  async create(formData) {
    const { data } = await api.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  }
};
