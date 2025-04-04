export interface Asset {
  _id: string;
  symbol: string;
  funding: number;
  spot: number;
  name: string;
  address: string;
  network: string;
  status: string;
}

export interface User {
  _id: string;
  uid: string;
  firstName?: string; // Optional fields
  lastName?: string;
  dateOfBirth?: string;
  phone?: string;
  country?: string;
  documentType?: string;
  documentNumber?: string;
  documentFront?: string;
  documentBack?: string;
  kycStatus: string;

  email: string; // Required fields
  password: string;
  referral?: string;
  isEmailVerified: boolean;

  tradingStatus: string;
  tradingLevel: string;
  tradingLimit: string;
  isTradeSuspended: boolean,
	minDeposit: number,
	maxDeposit: number,
	minWithdrawal: number,
	maxWithdrawal: number,

  assets: Asset[];

  accountStatus: 'pending' | 'suspended' | 'deactivated'
  createdAt: string;
}
