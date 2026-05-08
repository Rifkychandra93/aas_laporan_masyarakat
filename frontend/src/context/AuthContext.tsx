import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { loginUser } from "../services/authService";
import type {
  AuthContextType,
  DecodedToken,
  LoginPayload,
} from "../types/auth.types";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser(decoded);
        }
      } catch {
        logout();
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (payload: LoginPayload) => {
    const data = await loginUser(payload);
    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
