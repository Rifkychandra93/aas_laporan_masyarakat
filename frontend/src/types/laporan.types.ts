export interface Laporan {
  id: number;
  title: string;
  description: string;
  latitude: string;
  longitude: string;
  severity: string;
  status: string;
  image: string | null;

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