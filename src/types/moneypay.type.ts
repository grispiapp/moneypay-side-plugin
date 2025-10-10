/**
 * MoneyPay API Request and Response Types
 */

// Request Types
export interface GetPaymentDetailsRequest {
  startDate: string;
  endDate: string;
  storeNumber?: string;
  laneNumber?: string;
  transactionNumber?: string;
  transactionType?: "0" | "1" | "2" | "";
  migrosTransactionId?: string;
  moneypayTransactionId?: string;
  userId?: string;
}

// Response Types
export interface MoneyPayTransaction {
  tarih: string | null; // Date
  magaza: string | null; // Store
  kasa: string | null; // Cash Register
  kasiyer: string | null; // Cashier
  belge: string | null; // Document
  tutar: number | null; // Amount
  islemTuru: string | null; // Transaction Type
  ref: string | null; // Reference
  mcc: string | null; // MCC
  gsm: string | null; // GSM/Phone
  moneypayDurum: string | null; // MoneyPay Status
  kasaDurum: string | null; // Cash Register Status
  dwDurum: string | null; // DW Status
  renklendir: number; // Highlight flag (0 or 1)
}

export interface GetPaymentDetailsResponse {
  success: boolean;
  data: MoneyPayTransaction[];
  message?: string;
  error?: string;
}

// Transaction Type Enum
export enum TransactionType {
  Type0 = "0",
  Type1 = "1",
  Type2 = "2",
}

// Status mapping helpers
export const getStatusColor = (status: string | null): string => {
  if (!status) return "gray";

  // You can customize these based on actual status values
  switch (status.toLowerCase()) {
    case "success":
    case "başarılı":
    case "ok":
      return "green";
    case "pending":
    case "beklemede":
    case "wait":
      return "yellow";
    case "failed":
    case "hata":
    case "error":
      return "red";
    default:
      return "gray";
  }
};

export const getStatusLabel = (status: string | null): string => {
  if (!status) return "Bilinmiyor";

  // You can customize these based on actual status values
  switch (status.toLowerCase()) {
    case "success":
    case "ok":
      return "Başarılı";
    case "pending":
    case "wait":
      return "Beklemede";
    case "failed":
    case "error":
      return "Hatalı";
    default:
      return status;
  }
};
