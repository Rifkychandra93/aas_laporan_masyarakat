export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  createdAt: string;
}

export interface DecodedToken {
  id: number;
  name: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  iat: number;
  exp: number;
}

export interface AuthContextType {
  token: string | null;
  user: DecodedToken | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  updateToken: (newToken: string) => void;
  isAuthenticated: boolean;
}
