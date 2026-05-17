import { api } from "./api";

export const createComment = async (comment: string, laporanId: number): Promise<any> => {
  const response = await api.post("/comment", { comment, laporanId });
  return response.data;
};

export const deleteComment = async (id: number): Promise<any> => {
  const response = await api.delete(`/comment/${id}`);
  return response.data;
};
