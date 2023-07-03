import apiClient from "./services";

export default {
  getEmployees() {
    return apiClient.get("employees");
  },
  getEmployeeByEmployeeId(employeeId) {
    return apiClient.get(`employee/${employeeId}`);
  },
  addEmployee(payload) {
    return apiClient.post(`employee`, payload);
  },
  updateEmployee(employeeId, payload) {
    return apiClient.put(`employee/${employeeId}`, payload);
  },
  deleteEmployee(employeeId) {
    return apiClient.delete(`employee/${employeeId}`);
  },
};