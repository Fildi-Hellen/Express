export interface Vendor {
    id: number;
    name: string;
    email: string;
    status?: string; // Optional because it may not exist initially
  }
  