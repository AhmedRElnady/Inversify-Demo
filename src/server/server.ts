import { Container, ContainerModule } from "inversify";
import * as express from "express";
import { InversifyExpressServer } from "inversify-express-utils";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import { DbClient, getDbClient } from "../config/db/mongoose";
import { TYPES } from "../config/constants/types";
import { getDsClient } from "../services/deepstream.service";
import swaggerUI from "../api/middlewares/swagger";

// import * as acl from "express-acl";




export async function start(
    
    container: Container,
    appConfig: Object,
    dbConfig: Object,
    // deepstreamConfig: object,
    ...modules: ContainerModule[]

) {

    // acl.config()
   
    if(container.isBound(TYPES.App) === false) {
        const { port } = appConfig,
            { host: dbHost, name: dbName} = dbConfig;
            // { host: dsHost, port: dsPort, options, authLogin } = deepstreamConfig;

    
        const dbClient = await getDbClient(dbHost, dbName);
        container.bind<DbClient>(TYPES.DbClient).toConstantValue(dbClient);
        
        // const dsClient = await getDsClient(dsHost, dsPort, options, authLogin);
        // container.bind<any>(TYPES.DsClient).toConstantValue(dsClient);

        container.load(...modules); // load all registered modules 
        /*
            1. Configure the inversify container in your composition root as usual.

            Then, pass the container to the InversifyExpressServer constructor. 
            This will allow it to register all controllers and their dependencies from your container and attach them to the express app. 
            Then just call server.build() to prepare your app.
            ----------------
            configure express server 
            
        */
        const server = new InversifyExpressServer(container);

        server.setConfig((app) => {
            app.use(bodyParser.urlencoded({ extended: true }));
            app.use(bodyParser.json());

            app.use(helmet());
            // app.use(passport.initialize());

            app.use('/docs', swaggerUI.serve, swaggerUI.setup);
        
        });

        server.setErrorConfig((app) => {
           // to do
        });

        const app = server.build();

        // Run express server
        console.log(`Application listening on port ${port}...`);
        app.listen(port);

        container.bind<express.Application>(TYPES.App).toConstantValue(app);
        return app;
    } else {
        return container.get<express.Application>(TYPES.App);
    }

}
