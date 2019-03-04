import * as deepstream from "deepstream.io-client-js";

export async function getDsClient(dsHost: string, dsPort: string, options: object, authLogin: object) {
    return new Promise((resolve, reject) => {
        const connString = `${dsHost}:${dsPort}`;

        const client = deepstream(connString, options)
            .login(authLogin, (success, clientData) => {
                // client.presence.subscribe();
                if (success) {
                    resolve(client);
                }
            })
            .on('connectionStateChanged', connection => {

            })
            .on('error', (err: Error) => {
                console.log(">>>>>>> err form deepstreaaaaaaam >>>>", err);
                reject(err);
            })
        
    }) 
}
