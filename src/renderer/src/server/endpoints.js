export const AuthApiEndpoints = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  ME: "/auth/me",
};

export const AdminApiEndpoints = {
  GET_PRODUCTS: "/v1/products",
  CREATE_PRODUCT: "/v1/products",
  GET_PRODUCT: (id) => `/v1/products/${id}`,
  UPDATE_PRODUCT: (id) => `/v1/products/${id}`,
  DELETE_PRODUCT: (id) => `/v1/products/${id}`,

  GET_ORDERS: "/v1/orders",
  CREATE_ORDER: "/v1/orders",
  GET_ORDER: (id) => `/v1/orders/${id}`,
  DELETE_ORDER: (id) => `/v1/orders/${id}`,

  GET_CASHIERS: "/v1/cashiers",
  CREATE_CASHIER: "/v1/cashiers",
  GET_CASHIER: (id) => `/v1/cashiers/${id}`,
  UPDATE_CASHIER: (id) => `/v1/cashiers/${id}`,
  DELETE_CASHIER: (id) => `/v1/cashiers/${id}`,

  GET_STATS: "/v1/dashboard",
}
