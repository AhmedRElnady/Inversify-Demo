// TODO: Refactor ... Make it a factory 

class ValidationError extends Error {
    name: string;
    status: number;
    message;
    constructor(statusCode, message) {
        super();
        this.name = 'ValidationError';
        this.status = statusCode;
        this.message = message
        
        Object.setPrototypeOf(this, ValidationError.prototype);
    }

    static NotFound(ErrObj: any, fieldExistsIn = 'body') {
        return new ValidationError(404, { [fieldExistsIn]: [ErrObj]});
    }

    static BadRequest(ErrObj: any, fieldExistsIn = 'body') {
        return new ValidationError(400, { [fieldExistsIn]: [ErrObj] });
    }

    static UnprocessableEntity(ErrObj: any, fieldExistsIn = 'body') {
        return new ValidationError(422, { [fieldExistsIn]: [ErrObj] });
    }

    static UnprocessableEntities(ErrObj: any, fieldExistsIn = 'body') {
        return new ValidationError(422, { [fieldExistsIn]: [ErrObj] });
    }

    static Forbidden(ErrObj: any, fieldExistsIn = 'body') {
        return new ValidationError(403, { [fieldExistsIn]: [ErrObj] });
    }
  
}

export { ValidationError };