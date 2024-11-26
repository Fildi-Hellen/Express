// src/app/models/menu.model.ts

export interface Menu {
    id: number;
    name: string;
    establishmentType: string;
    description?: string;
    price?: number;
    additionalAttributes?: { [key: string]: any };
  }
  