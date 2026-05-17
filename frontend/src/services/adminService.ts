import axios from "axios";

const API_URL = "http://localhost:3000/api/admin";

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export interface AdminStats {
  totalLaporan: number;
  pendingLaporan: number;
  approvedLaporan: number;
  rejectedLaporan: number;
  totalUser: number;
  totalCategory: number;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  location: string | null;
  createdAt: string;
  _count?: {
    laporan: number;
  };
}

export const getAdminStats = async (): Promise<AdminStats> => {
  const response = await axios.get(`${API_URL}/dashboard/stats`, {
    headers: getHeaders(),
  });
  return response.data;
};

export const getAllUsers = async (): Promise<AdminUser[]> => {
  const response = await axios.get(`${API_URL}/users`, {
    headers: getHeaders(),
  });
  return response.data;
};

export const approveLaporan = async (id: number) => {
  const response = await axios.put(
    `${API_URL}/laporan/${id}/approve`,
    {},
    {
      headers: getHeaders(),
    }
  );
  return response.data;
};

export const rejectLaporan = async (id: number) => {
  const response = await axios.put(
    `${API_URL}/laporan/${id}/reject`,
    {},
    {
      headers: getHeaders(),
    }
  );
  return response.data;
};

export const deleteLaporanAdmin = async (id: number) => {
  const response = await axios.delete(
    `${API_URL}/laporan/${id}`,
    {
      headers: getHeaders(),
    }
  );
  return response.data;
};
