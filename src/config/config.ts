export default {
        server: {
            port: 3000
        },
        db: {
            // database: 'mongodb://localhost:27017/spusers'
            host: "localhost",
            name: "indexgroup"
        },
        deepstream: {
            host: "localhost",
            port: 6020,
            options: {
                maxReconnectInterval: 1000,
                reconnectIntervalIncrement: 500,
                maxReconnectAttempts: Infinity,
                heartbeatInterval: 60000
            },
            authLogin: {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE3MCwiaXNzIjoiQXBwIiwiaWF0IjoxNTM1NTUxMzg2ODE1LCJleHAiOjE1MzU1NTEzOTQwMTV9.uVA-ingWWMmbFP1Kl1a_TMws_R_Ov5ip4hioYih2xps',
                loginAs: 'PROVIDER', 
                id: 170
            }
        }


}





