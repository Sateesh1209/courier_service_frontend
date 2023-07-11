import apiClient from "./services";

export default {
  getCustomers() {
    return apiClient.get("customers");
  },
  getCustomerByCustomerId(customerId) {
    return apiClient.get(`customer/${customerId}`);
  },
  addCustomer(payload) {
    return apiClient.post(`customer`, payload);
  },
  updateCustomer(customerId, payload) {
    return apiClient.put(`customer/${customerId}`, payload);
  },
  deleteCustomer(customerId) {
    return apiClient.delete(`customer/${customerId}`);
  },
};
