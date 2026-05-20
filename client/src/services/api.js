import axios from "axios";

const baseURL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api/transactions";

const api = axios.create({
  baseURL
});

const cleanParams = (params = {}) => {
  const next = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      next[key] = value;
    }
  });

  return next;
};

export const fetchTransactions = async (params) => {
  const response = await api.get("/", { params: cleanParams(params) });
  return response.data;
};

export const fetchStats = async (params) => {
  const response = await api.get("/stats", { params: cleanParams(params) });
  return response.data;
};

export const createTransaction = async (payload) => {
  const response = await api.post("/", payload);
  return response.data;
};

export const updateTransaction = async (id, payload) => {
  const response = await api.put(`/${id}`, payload);
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};

