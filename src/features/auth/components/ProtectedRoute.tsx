import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../../state/hooks";
import type { JSX } from "react";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token, user } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!token && !!user;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// import { Navigate } from "react-router-dom";
// import { useAppSelector } from "../../../state/hooks";
// import type { JSX } from "react";

// export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
//   const { token, status } = useAppSelector((state) => state.auth);
//   const isAuthenticated = !!token && status === "succeeded";

//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };