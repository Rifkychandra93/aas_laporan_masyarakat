import axios from "axios";

const API_URL = "http://localhost:3000/api/notification";

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getNotifications = async () => {
  const response = await axios.get(API_URL, { headers: getHeaders() });
  return response.data;
};

export const markNotificationAsRead = async (id: number) => {
  const response = await axios.put(`${API_URL}/${id}/read`, {}, { headers: getHeaders() });
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await axios.put(`${API_URL}/read-all`, {}, { headers: getHeaders() });
  return response.data;
};
