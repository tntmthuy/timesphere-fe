// src/features/auth/AuthWatcher.tsx
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { logout } from "./authSlice";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const AuthWatcher = () => {
  const { token } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const { exp } = jwtDecode<{ exp: number }>(token);
        if (Date.now() >= exp * 1000) {
          dispatch(logout());
          navigate("/login");
        }
      } catch {
        dispatch(logout());
        navigate("/login");
      }
    }
  }, [token, dispatch, navigate]);

  return null;
};