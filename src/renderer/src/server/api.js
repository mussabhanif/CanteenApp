import { AdminApiEndpoints, AuthApiEndpoints, SettingsApiEndpoints } from "./endpoints";
import client from "./services";

export const SettingsApi = {
  getAppStatus: () => client.get(SettingsApiEndpoints.GET_APP_STATUS),
  // updateAppStatus: (data) => client.get(SettingsApiEndpoints.UPDATE_APP_STATUS, data)
}

export const AuthApi = {
  login: (data) => client.post(AuthApiEndpoints.LOGIN, data),
  logout: () => client.post(AuthApiEndpoints.LOGOUT),
  getProfile: () => client.get(AuthApiEndpoints.ME),
};

export const AdminApi = {
  getProducts: (params) => client.get(AdminApiEndpoints.GET_PRODUCTS+`?page=${params?.page}&search=${params?.search || ''}`),
  createProduct: (data) => client.post(AdminApiEndpoints.CREATE_PRODUCT, data),
  getProduct: (id) => client.get(AdminApiEndpoints.GET_PRODUCT(id)),
  updateProduct: (id, data) => client.put(AdminApiEndpoints.UPDATE_PRODUCT(id), data),
  deleteProduct: (id) => client.delete(AdminApiEndpoints.DELETE_PRODUCT(id)),
  updateProductStatus: (id) => client.put(AdminApiEndpoints.UPDATE_PRODUCT_STATUS(id)),

  getOrders: (params) => client.get(AdminApiEndpoints.GET_ORDERS+`?page=${params?.page}&search=${params?.search || ''}&status=${params?.status || ''}`),
  getOrderCreateData: () => client.get(AdminApiEndpoints.GET_ORDER_CEATE_DATA),
  createOrder: (data) => client.post(AdminApiEndpoints.CREATE_ORDER, data),
  getOrder: (id) => client.get(AdminApiEndpoints.GET_ORDER(id)),
  deleteOrder: (id) => client.delete(AdminApiEndpoints.DELETE_ORDER(id)),
  updateOrderStatus: (id, status) => client.put(AdminApiEndpoints.UPDATE_ORDER_STATUS(id), status),

  getCashiers: (params) => client.get(`${AdminApiEndpoints.GET_CASHIERS}?page=${params?.page}&search=${params?.search || ''}`),
  createCashier: (data) => client.post(AdminApiEndpoints.CREATE_CASHIER, data),
  getCashier: (id) => client.get(AdminApiEndpoints.GET_CASHIER(id)),
  updateCashier: (id, data) => client.put(AdminApiEndpoints.UPDATE_CASHIER(id), data),
  deleteCashier: (id) => client.delete(AdminApiEndpoints.DELETE_CASHIER(id)),

  getStats: () => client.get(AdminApiEndpoints.GET_STATS),
};

