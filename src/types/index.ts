export interface Image {
  id: string;
  jpegUrl: string;
  webpUrl: string;
}

export interface Photographer {
  id: string;
  username: string;
  displayName: string;
}

export interface Photo {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string | null;
  width: number;
  height: number;
  photographer: Photographer;
  images: Image[];
}

export interface PhotoSearchFilter {
  key: string;
  value: string;
}
