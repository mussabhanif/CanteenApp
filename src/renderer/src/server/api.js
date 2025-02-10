import { AdminApiEndpoints, AuthApiEndpoints } from "./endpoints";
import client from "./services";

export const AuthApi = {
  login: (data) => client.post(AuthApiEndpoints.LOGIN, data),
  logout: () => client.post(AuthApiEndpoints.LOGOUT),
  getProfile: () => client.get(AuthApiEndpoints.ME),
};

export const AdminApi = {
  getProducts: (params) => client.get(AdminApiEndpoints.GET_PRODUCTS+`?page=${params?.page}`),
  createProduct: (data) => client.post(AdminApiEndpoints.CREATE_PRODUCT, data),
  getProduct: (id) => client.get(AdminApiEndpoints.GET_PRODUCT(id)),
  updateProduct: (id, data) => client.put(AdminApiEndpoints.UPDATE_PRODUCT(id), data),
  deleteProduct: (id) => client.delete(AdminApiEndpoints.DELETE_PRODUCT(id)),

  getOrders: (params) => client.get(AdminApiEndpoints.GET_ORDERS+`?page=${params?.page}`),
  createOrder: (data) => client.post(AdminApiEndpoints.CREATE_ORDER, data),
  getOrder: (id) => client.get(AdminApiEndpoints.GET_ORDER(id)),
  deleteOrder: (id) => client.delete(AdminApiEndpoints.DELETE_ORDER(id)),

  getCashiers: (params) => client.get(`${AdminApiEndpoints.GET_CASHIERS}?page=${params?.page}`),
  createCashier: (data) => client.post(AdminApiEndpoints.CREATE_CASHIER, data),
  getCashier: (id) => client.get(AdminApiEndpoints.GET_CASHIER(id)),
  updateCashier: (id, data) => client.put(AdminApiEndpoints.UPDATE_CASHIER(id), data),
  deleteCashier: (id) => client.delete(AdminApiEndpoints.DELETE_CASHIER(id)),

  getStats: () => client.get(AdminApiEndpoints.GET_STATS),
};
