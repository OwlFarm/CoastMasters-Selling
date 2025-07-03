export type Yacht = {
  id: number;
  name: string;
  type: 'Motor' | 'Sailing' | 'Catamaran';
  price: number;
  year: number;
  length: number; // in feet
  location: string;
  imageUrl: string;
  imageHint: string;
};
