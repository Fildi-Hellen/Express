export interface Menu {
    id: number;
    name: string;
    description?: string;
    price?: number;
    image?: string;
    imageUrl?: string;
    additionalAttributes?: { [key: string]: any };
  }
  