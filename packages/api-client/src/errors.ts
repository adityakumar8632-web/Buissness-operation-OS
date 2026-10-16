import { ApiError } from '@business-os/types';

export class DomainError extends Error {
  public code: string;
  public status: number;
  public details?: Record<string, unknown>;

  constructor(status: number, message: string, code: string = 'UNKNOWN_ERROR', details?: Record<string, unknown>) {
    super(message);
    this.name = 'DomainError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function parseApiError(status: number, data: any): DomainError {
  const message = data?.message || 'An unexpected error occurred';
  const code = data?.code || mapStatusToCode(status);
  
  return new DomainError(status, message, code, data?.details);
}

function mapStatusToCode(status: number): string {
  switch (status) {
    case 400: return 'BAD_REQUEST';
    case 401: return 'UNAUTHORIZED';
    case 403: return 'FORBIDDEN';
    case 404: return 'NOT_FOUND';
    case 409: return 'CONFLICT';
    case 422: return 'UNPROCESSABLE_ENTITY';
    case 500: return 'INTERNAL_SERVER_ERROR';
    default: return 'API_ERROR';
  }
}