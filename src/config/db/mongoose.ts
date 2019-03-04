import * as mongoose from "mongoose";

export type DbClient = mongoose.Mongoose;

export async function getDbClient(dbHost: string, dbName: string) {
    return new Promise<DbClient>((resolve, reject) => {
        const connString = `mongodb://${dbHost}/${dbName}`;
        mongoose.connect(connString);
        
        const db = mongoose.connection;

        db.on('error', (err: Error) => {
            // mediator.emit('db.error', err);
            reject(err);
        });

        db.once("open", ()=> {
            console.log("Db conenction success:", connString);
            // mediator.emit('db.ready', mongoose);
            resolve(mongoose);
        })
    })
}
