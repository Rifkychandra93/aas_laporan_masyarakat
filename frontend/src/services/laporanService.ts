import axios from "axios";

const API_URL = "http://localhost:3000/api/laporan";

export const getAllLaporan = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};