export interface InfoPortalErrorResponse {
  message?: string;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

