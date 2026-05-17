import { api } from "./api";

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  createdAt: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await api.get("/notification");
  return response.data;
};

export const markAllAsRead = async (): Promise<any> => {
  const response = await api.put("/notification/read-all");
  return response.data;
};

export const markAsRead = async (id: number): Promise<any> => {
  const response = await api.put(`/notification/${id}/read`);
  return response.data;
};
