export interface Asset {
  _id: string;
  symbol: string;
  funding: number;
  spot: number;
  name: string;
  address: string;
  network: string;
}

export interface User {
  _id: string;
  firstName?: string; // Optional fields
  lastName?: string;
  dateOfBirth?: string;
  phone?: string;
  country?: string;
  documentType?: string;
  documentFront?: string;
  documentBack?: string;

  email: string; // Required fields
  password: string;
  referral?: string;
  isEmailVerified: boolean;

  tradingStatus: string;
  tradingLevel: string;
  tradingLimit: string;

  assets: Asset[]; // Array of Asset objects

  disabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}
