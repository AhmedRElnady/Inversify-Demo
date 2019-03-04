import { injectable, unmanaged } from "inversify";/// to flag that the argumnet will not managed by the conatainer
/// to use mongoose
import { Schema, Document, Model, SchemaDefinition } from "mongoose";

 /// has mongoose connection 
 /// to enable me to inject mongoose in this generic repository,
 /// i will aslo inject the native mongo to use 
import { DbClient } from "../config/db/mongoose";
/// to use as decorator
import { dbClient } from "../config/constants/decorators"; 
/// the interface to implement it
import { Repositrory, Query } from "../config/interfaces/repositories";

@injectable() 
export class GenericCRUDRepository<TEntity, TModel extends Document>
    implements Repositrory<TEntity> {

    private _name: string;
    protected Model: Model<TModel>;

    // construcotr 
    public constructor (
        @dbClient dbClient: DbClient, ///to  deal with it as mongoose 
        @unmanaged() name: string,
        @unmanaged() schemaDefinition: SchemaDefinition
    ) {
        /// the singular name of the collection your model is for
        this._name = name; 
        ///see https://mongoosejs.com/docs/guide.html#collection
        const schema = new Schema(schemaDefinition, { collection: this._name })
        /// see https://mongoosejs.com/docs/models.html
        this.Model = dbClient.model<TModel>(this._name, schema)
    }

    public async create(doc: TEntity) {
        return new Promise<TEntity>((resovle, reject) => {
            const docInstance = new this.Model(doc);
            docInstance.save((err, res) => {
                if (err) reject(err);

                resovle(this._readMapper(res));
            })
        })
    }

    public async findAll() {
        return new Promise<TEntity[]>((resolve, reject) => {
            this.Model.find((err, res) => {
                if (err) {
                    reject(err);
                }
                const result = res.map(r => this._readMapper(r));
                resolve(result);
            })
        })
    }

    public async findById(id: string) {
        return new Promise<TEntity>((resolve, reject) => {
            this.Model.findById(id, (err, res) => {
                if(err) {
                    reject(err)
                } else if(res === null) {
                    reject({msg: "not found"});
                } else {
                    resolve(this._readMapper(res));
                }
            })
        })
    }
    
    
    // ToDo: write function to get model after creation 
    public async getModel() {
        return this.Model;
    }

    

    private _readMapper(model: TModel) {
        const obj: any = model.toJSON();
        Object.defineProperty(obj,"id", Object.getOwnPropertyDescriptor(obj, "_id"));
        delete obj["_id"];
        return obj as TEntity;
    }

    
} // end class 