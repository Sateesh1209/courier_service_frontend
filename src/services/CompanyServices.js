import apiClient from "./services";

export default {
  getCompanyDetails() {
    return apiClient.get("companyInfo");
  },
  updateCompanyDetails(companyId, payload) {
    return apiClient.put(`companyInfo/${companyId}`, payload);
  },
};
