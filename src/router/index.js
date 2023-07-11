import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("../views/Login.vue"),
    },
    {
      path: "/Dashboard",
      name: "dashboard",
      component: () => import("../views/Dashboard.vue"),
    },
    {
      path: "/Company",
      name: "company",
      component: () => import("../views/Company.vue"),
    },
    {
      path: "/Employees",
      name: "employees",
      component: () => import("../views/Employees.vue"),
    },
    {
      path: "/Couriers",
      name: "couriers",
      component: () => import("../views/Couriers.vue"),
    },
    {
      path: "/Customers",
      name: "customers",
      component: () => import("../views/Customers.vue"),
    },
  ],
});

export default router;
