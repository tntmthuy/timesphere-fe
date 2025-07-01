// src/api/axios.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8081", // 👈 backend Spring Boot port
  withCredentials: false,           // nếu không dùng cookie
});

