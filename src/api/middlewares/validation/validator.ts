import * as express from "express";
import * as Ajv from 'ajv';
import * as moment from 'moment';
import { ValidationError } from "./validationError";

class validator {

    public ajv: any; 
    private ajvCustomKeywords = {
        idExistsIn: {
            async: true,
            type: 'number', 
            validate: async (Model: any, data: any) => {
                
                    try {
                        const doc = await Model.findById(data); 
                        if(!doc) throw new Error();
        
                        return true;
                        
                    } catch (err) {
                        
                        // throw new Ajv.ValidationError([{ keyword: 'NotFound', message: `RefId is not found in ${Model.modelName}`}])
                        console.log(">>>>> err >>>>", err);
                    }
             

            }
        },
    
        isNotEmpty: {
            type: 'string',
            errors: false,
            validate: function (schema:any, data: any) {
                return typeof data === 'string' && data.trim() !== '';
            }
        },
    
        isTimeStamp: {
            type: 'number',
            errors: true,
            validate: this.validateTimestamp
        },
    
        isTimestampInTheFuture: {
            type: 'number',
            errors: true,
            /// TODO: need a refactor (caching)
            validate: this.validateFutureDate
            
        },
    
        // isLocation: {
        // 	type: 'array',
        // 	errors: true,
        // 	validate: validateLocation
        // }
    }

    constructor(ajvOptions: object) {
        console.log('....... msg from constructor');
        this.ajv = this.addAjvCustomKeyWords(new Ajv(ajvOptions));
    }


    validateMiddleware() {
        return (options) => {
            
            const validateFunctions = Object.keys(options).map((reqProperty) => {
                const schema = options[reqProperty];
                const validateFunction = this.ajv.compile(schema);
                return { reqProperty, validateFunction }
            });

            return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    
                (async () => {
                    
                    let validationErrors = {};
                    
                    for (let {reqProperty, validateFunction} of validateFunctions) {
                        try {
                            
                            const valid = await validateFunction(req[reqProperty]);
                            console.log(">>>>> valid >>>>", valid);
                            
                            if (!valid) validationErrors[reqProperty] = validateFunction.errors;
                    
                        } catch (err) {
                            if (err.validation) {
                                validationErrors[reqProperty] = err.errors;
                            } else {
                                console.log('Validation caught Error', err);
                            }
                        }
                    } // end for 

                    console.log(">>>>>> validationErrors >>>>>>", validationErrors);

                    if (Object.keys(validationErrors).length !== 0) {
                        return next(new ValidationError(
                            Object.keys(validationErrors).includes('body') ? 422 : 400,
                            validationErrors
                        ));
                    } else {
                        return next();
                    }
                })();
            }
        };
    }

    private addAjvCustomKeyWords(ajvRef: any) {
        Object.keys(this.ajvCustomKeywords).forEach(key => {
            ajvRef.addKeyword(key, this.ajvCustomKeywords[key])
        });

        // console.log("###### ajvRef ######", ajvRef);

        return ajvRef;
    }

    private validateTimestamp (schema, data){
        if (typeof data === 'number' || moment(data).isValid()) {
            return true;
    
        } else {
            if (this.validateTimestamp.errors === null)
                    this.validateTimestamp.errors = [];
    
            this.validateTimestamp.errors.push({
                keyword: 'isTimestamp',
                message: 'Should be a timestamp'
            });
            return false;
        }
    }

    private validateFutureDate(schema, data) {

        if ((this.validateTimestamp(schema, data)) && (moment(data).isAfter(moment()))) {
            return true;
        } else {
            if (this.validateFutureDate.errors === null)
                this.validateFutureDate.errors = [];

            this.validateFutureDate.errors.push({
                keyword: 'isTimestampInTheFuture',
                message: 'Should be a timestamp in the future'
            });
            return false;
        }
    }
}


let validatorInstance = new validator({ coerceTypes: true, allErrors: true, removeAdditional: true, jsonPointers: true, $data: true });

let validate = validatorInstance.validateMiddleware();
export { validate };
