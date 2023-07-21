import apiClient from "./services";

export default {
  getCouriers(statusId, customerId) {
    return apiClient.get(`orders/${statusId}/${customerId}`);
  },
  getCouriersByEmployee(employeeId) {
    return apiClient.get(`ordersAssignedTo/${employeeId}`);
  },
  getCourierByCourierId(orderId) {
    return apiClient.get(`order/${orderId}`);
  },
  addCourier(payload) {
    return apiClient.post(`order`, payload);
  },
  updateCourier(orderId, payload) {
    return apiClient.put(`order/${orderId}`, payload);
  },
  assignCourier(orderId, payload) {
    return apiClient.put(`order/assign/${orderId}`, payload);
  },
  updateOrderStatus(orderId, payload) {
    return apiClient.put(`order/updateStatus/${orderId}`, payload);
  },
  deleteCourier(orderId) {
    return apiClient.delete(`order/${orderId}`);
  },
};
