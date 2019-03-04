import { injectable } from "inversify";
import * as express from "express";
import { Controller, Get , Post } from "inversify-express-utils";
import { userRepository } from "../../config/constants/decorators"; // to inject it to the class 
import { validate, ValidationError } from "../middlewares/validation";
import { IDeapStreamService } from "../../config/interfaces/services";

import { authMiddleware } from "../middlewares/auth.middleware.test";
import { generateToken } from "../../utils/jwt";
import * as passport from "passport";
/*
this just the interface not the implementation,
and this exactly what we called DIP (Dependency Inversion Priciple)
this will be bind to the implementaion at the run time

so i can sya this file now is decoupled one.
*/
import { UserRepository } from "../../config/interfaces/repositories"; 




export const addNewUserSchema = {
    title: 'Add New User Schema',
    type: 'object',
    required: ['firstName', 'lastName', 'email', 'password'],
    additionalProperties: false,
    properties: {
        id: {type: 'string'},
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: {type:'string'},
        password: {type: 'string'},
        roles: {type: 'string', default: 'ordiUser'}
    }
}

@injectable()
@Controller('/users')
export class UserController {
    @userRepository protected repository: UserRepository;


    // @Get('/')
    // @Get('/', authMiddleware(), passport.authenticate('jwt', {session: false}))
    @Get('/', authMiddleware())
    public async getAll() {
        // const mongooseModel = await this.repository.getModel();
        // mongooseModel.findById({})
        // return await this.repository.findById('5c23e1a2ce4d572db3864352');
        return await this.repository.findAll();

    }

    @Post('/', validate({ body: addNewUserSchema}))
    public async createUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            return await this.repository.create(req.body);
        } catch (err) {
            res.status(400).json({
                error: err.message
            })
        }
    }

    @Post('/signup/', validate({ body: addNewUserSchema})) 
    public async signUp (req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            
            const user = await this.repository.create(req.body);
            console.log(">>> user >>>>", user.id)
            user.accessToken = generateToken(user.id, 'elnady', '120000');
            res.status(201).json({
                success: 'success',
                msg: 'signup successfully',
                user
            })

        } catch (err){

        }
    }

    
        
}