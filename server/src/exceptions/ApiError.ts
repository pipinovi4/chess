export default class ApiError extends Error {
    status: number;
    errors: Error | Error[] | null;
  
    constructor(status: number, message: string, errors?: Error | Error[]) {
      super(message);
      this.status = status;
      this.errors = errors ? errors : null;
    }
  
    static UnAuthorizedError(): ApiError {
      return new ApiError(401, 'User not authorized');
    }
  
    static BadRequest(message: string, error?: Error | Error[]): ApiError {
      return new ApiError(400, message, error);
    }

    static UnforeseenError(message?: string, error?: Error) {
      return new ApiError(500, `Unforseen error: ${message}`, error)
    }
  }
  