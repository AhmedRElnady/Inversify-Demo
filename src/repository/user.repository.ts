import { injectable } from "inversify";
import { Document } from "mongoose";

import { DbClient } from "../config/db/mongoose";
import { dbClient } from "../config/constants/decorators";

import { GenericCRUDRepository } from "../repository/generic.repository";
import { User } from "../models/users";
import { UserRepository as UserRepositoryInterface } from "../config/interfaces/repositories";

export interface UserModel extends User, Document {}

@injectable() 
export class UserRepository 
    extends GenericCRUDRepository<User, UserModel>
    implements UserRepositoryInterface {

        public constructor(
            @dbClient dbClient: DbClient
        ) {
            super(dbClient, "users", {id: String, firstName: String, lastName: String, 
                email: String, 
                passowrd: String,
                roles: String
             })
        } // end constructor 


        


} // end class
    
