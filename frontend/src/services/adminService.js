import api from "./api.js";

export const adminService = {
  async dashboard() {
    const { data } = await api.get("/admin/dashboard");
    return data;
  },

  async users() {
    const { data } = await api.get("/admin/users");
    return data;
  },

  async updateRole(id, role) {
    const { data } = await api.put(`/admin/users/${id}/role`, { role });
    return data;
  },

  async deleteUser(id) {
    const { data } = await api.delete(`/admin/users/${id}`);
    return data;
  }
};
