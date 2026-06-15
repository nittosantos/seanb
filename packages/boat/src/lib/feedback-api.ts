import { API_ENDPOINTS } from '@/config/api-endpoints';
import { apiFetch } from '@/lib/api-client';
import type {
  ContactHostInput,
  CreateHostInquiryInput,
  CreateListingReportInput,
  ListingReportReason,
  SuccessResponse,
} from '@seanb/shared';
import {
  mapContactHostFormToCreateInquiry,
  successResponseSchema,
} from '@seanb/shared';

export async function submitHostInquiry(
  slug: string,
  input: ContactHostInput | CreateHostInquiryInput,
  token?: string | null,
): Promise<SuccessResponse> {
  const body =
    'startDate' in input && input.startDate instanceof Date
      ? mapContactHostFormToCreateInquiry(input as ContactHostInput)
      : (input as CreateHostInquiryInput);

  return apiFetch<SuccessResponse>(API_ENDPOINTS.LISTING_INQUIRIES(slug), {
    method: 'POST',
    body: JSON.stringify(body),
    token,
    schema: successResponseSchema,
  });
}

export async function submitListingReport(
  slug: string,
  input: CreateListingReportInput,
  token?: string | null,
): Promise<SuccessResponse> {
  return apiFetch<SuccessResponse>(API_ENDPOINTS.LISTING_REPORTS(slug), {
    method: 'POST',
    body: JSON.stringify(input),
    token,
    schema: successResponseSchema,
  });
}

export type { ListingReportReason };
