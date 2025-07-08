export type Yacht = {
  id: number;
  name: string;
  type: 'Motor' | 'Sailing' | 'Catamaran';
  listingType: 'Private' | 'Broker';
  price: number;
  year: number;
  length: number; // in feet
  location: string;
  imageUrl: string;
  imageHint: string;
};
