import apiClient from "./services";

export default {
  getCouriers() {
    return apiClient.get("couriers");
  },
  getCourierByCourierId(courierId) {
    return apiClient.get(`courier/${courierId}`);
  },
  addCourier(payload) {
    return apiClient.post(`courier`, payload);
  },
  updateCourier(courierId, payload) {
    return apiClient.put(`courier/${courierId}`, payload);
  },
  deleteCourier(courierId) {
    return apiClient.delete(`courier/${courierId}`);
  },
};
