import { api } from "./api";

export interface Laporan {
  id: number;
  title: string;
  description: string;
  image: string | null;
  latitude: number | null;
  longitude: number | null;
  severity: string;
  status: string;
  createdAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  category?: {
    id: number;
    name: string;
  };
}

export const getReports = async (): Promise<Laporan[]> => {
  const response = await api.get("/laporan");
  return response.data;
};

export const createLaporan = async (formData: FormData): Promise<any> => {
  const response = await api.post("/laporan", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getLaporanById = async (id: number): Promise<any> => {
  const response = await api.get(`/laporan/${id}`);
  return response.data;
};

export const deleteLaporan = async (id: number): Promise<any> => {
  const response = await api.delete(`/laporan/${id}`);
  return response.data;
};

export const updateLaporan = async (id: number, formData: FormData): Promise<any> => {
  const response = await api.put(`/laporan/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
