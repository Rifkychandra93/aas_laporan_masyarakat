import axios from "axios";

const API_URL = "http://localhost:3000/api/laporan";

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getAllLaporan = async () => {
  const response = await axios.get(API_URL, { headers: getHeaders() });
  return response.data;
};

export const getLaporanById = async (id: string | number) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: getHeaders(),
  });
  return response.data;
};

export const createLaporan = async (formData: FormData) => {
  const response = await axios.post(API_URL, formData, {
    headers: {
      ...getHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateLaporan = async (id: number, formData: FormData) => {
  const response = await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      ...getHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteLaporan = async (id: number) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: getHeaders(),
  });
  return response.data;
};

export const addComment = async (laporanId: number, comment: string) => {
  const response = await axios.post("http://localhost:3000/api/comment", {
    laporanId,
    comment
  }, {
    headers: getHeaders()
  });
  return response.data;
};

export const deleteComment = async (id: number) => {
  const response = await axios.delete(`http://localhost:3000/api/comment/${id}`, {
    headers: getHeaders()
  });
  return response.data;
};