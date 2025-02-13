import axios from "axios";
import { toast } from "../hooks/use-toast";

// export const STORAGE_URL = "http://localhost:8000"
export const STORAGE_URL = "https://canteen.karimapps.com"
// export const BASE_URL = "http://localhost:8000/api";
export const BASE_URL = "https://canteen.karimapps.com/api";

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
    console.error("API Error:", errorMessage);

    toast({
      variant: 'destructive',
      description: errorMessage === 'Unauthenticated.' ? 'Session Expired. Please login again' : errorMessage
    });

    return Promise.reject(error);
  }
);


export default client;
