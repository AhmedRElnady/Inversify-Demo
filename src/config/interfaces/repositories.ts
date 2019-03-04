import { User } from "../../models/users";
import { Model , Document} from "mongoose";

import { Repositrory } from "../interfaces/repositories";


export type Query<T> = {
    [P in keyof T]?: T[P] | { $regex: RegExp };
};

export interface Repositrory<T> {
      create(doc: T): Promise<T>;
      findAll(): Promise<T[]>;
      findById(id: string): Promise<T>;
      findByQuery?(query?: Query<T>): Promise<T[]>;
    //   getModel(): Model<T extends Document>;
}

export type UserRepository = Repositrory<User>;

