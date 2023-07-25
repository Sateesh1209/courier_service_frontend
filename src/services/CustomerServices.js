import apiClient from "./services";

export default {
  getCustomers() {
    return apiClient.get("customers");
  },
  getCustomerByCustomerId(customerId) {
    return apiClient.get(`customer/${customerId}`);
  },
  getCustomerOrdersList(customerId) {
    return apiClient.get(`customer/orders/${customerId}`);
  },
  generateBill(customerId) {
    return apiClient.get(`customers/generateBill`);
  },
  getCustomerByCustomerEmail(email) {
    return apiClient.get(`findCustomerByEmail/${email}`);
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
