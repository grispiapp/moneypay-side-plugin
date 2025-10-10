import { grispiAPI } from "@/grispi/client/api";
import { ApiResult } from "@/types/api.type";
import {
  GetPaymentDetailsRequest,
  MoneyPayTransaction,
} from "@/types/moneypay.type";

const API_BASE_URL = "http://localhost:8000";

/**
 * Converts a date from YYYY-MM-DD format to DD.MM.YYYY format
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date string in DD.MM.YYYY format
 */
function convertToDateFormat(dateString: string): string {
  const [year, month, day] = dateString.split("-");
  return `${day}.${month}.${year}`;
}

/**
 * Fetches payment details based on the provided filters
 * @param request - The payment details request parameters
 * @param signal - Optional AbortSignal to cancel the request
 * @returns Promise containing the API response with transaction data or error
 */
export async function getPaymentDetails(
  request: GetPaymentDetailsRequest,
  signal?: AbortSignal
): Promise<ApiResult<MoneyPayTransaction[]>> {
  const authorization = grispiAPI.authentication.getHeader("Authorization");

  if (!authorization) {
    return {
      statusCode: 401,
      data: { error: { description: "Unauthorized", type: "UNAUTHORIZED" } },
    };
  }

  // Convert dates to d.m.Y format before sending
  const formattedRequest = {
    ...request,
    startDate: convertToDateFormat(request.startDate),
    endDate: convertToDateFormat(request.endDate),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/moneypay/payment-details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(formattedRequest),
      signal,
    });

    const data = await response.json();

    // Return the response as-is, whether success or error
    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu";

    return {
      statusCode: 500,
      data: {
        error: {
          description: errorMessage,
          type: "UNKNOWN_ERROR",
        },
      },
    };
  }
}
