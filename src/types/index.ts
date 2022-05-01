export interface Image {
  id: string;
  size: number;
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
  legacyId: string;
  name: string;
  description: string;
  category: string;
  location: string | null;
  width: number;
  height: number;
  photographer: Photographer;
  notSafeForWork: boolean;
  tags: string[];
  images: Image[];
}

export interface PhotoSearchFilter {
  key: string;
  value: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Feature {
  id: string;
  name: string;
}
