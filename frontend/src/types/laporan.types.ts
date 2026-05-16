export interface Laporan {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  severity: string;
  status: string;
  image: string | null;
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
  
  comments?: {
    id: number;
    comment: string;
    createdAt: string;
    user: {
      id: number;
      name: string;
    };
  }[];
}