export default class ApiError extends Error {
    status: number;
    errors: Error[];
  
    constructor(status: number, message: string, errors: Error[] = []) {
      super(message);
      this.status = status;
      this.errors = errors;
    }
  
    static UnAuthorizedError(): ApiError {
      return new ApiError(401, 'User not authorized');
    }
  
    static BadRequest(message: string, errors: Error[] = []): ApiError {
      return new ApiError(400, message, errors);
    }

    static UnforseenError() {
      return new ApiError(500, 'Unforseen error')
    }
  }
  