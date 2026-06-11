import api from "./api.js";

export const orderService = {
  async create(payload) {
    const { data } = await api.post("/orders", payload);
    return data;
  },

  async mine() {
    const { data } = await api.get("/orders/my");
    return data;
  },

  async farmerOrders() {
    const { data } = await api.get("/orders/farmer");
    return data;
  },

  async all() {
    const { data } = await api.get("/orders");
    return data;
  },

  async updateStatus(id, status) {
    const { data } = await api.put(`/orders/${id}/status`, { status });
    return data;
  }
};
