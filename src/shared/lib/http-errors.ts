import { HTTP_STATUS } from "../constants/http-status";

export class RequestError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(
    statusCode: number,
    message: string,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = "RequestError";
  }
}

export class ValidationError extends RequestError {
  constructor(fieldErrors: Record<string, string[]>) {
    const message = ValidationError.formatMessage(fieldErrors);
    super(HTTP_STATUS.BAD_REQUEST, message, fieldErrors);
    this.name = "ValidationError";
    this.errors = fieldErrors;
  }

  static formatMessage(errors: Record<string, string[]>): string {
    const formattedMessages = Object.entries(errors).map(
      ([field, messages]) => {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);

        if (messages[0] === "Required") {
          return `${fieldName} is required`;
        } else {
          return messages.join(" and ");
        }
      },
    );
    return formattedMessages.join(", ");
  }
}
export class NotFoundError extends RequestError {
  constructor(resource: string) {
    super(HTTP_STATUS.NOT_FOUND, `${resource} not found`);
    this.name = "NotFoundError";
  }
}
export class ForbiddenError extends RequestError {
  constructor(message: string = "Forbidden") {
    super(HTTP_STATUS.FORBIDDEN, message);
    this.name = "ForbiddenError";
  }
}

export class UnauthorizedError extends RequestError {
  constructor(message: string = "Unauthorized") {
    super(HTTP_STATUS.UNAUTHORIZED, message);
    this.name = "UnauthorizedError";
  }
}
