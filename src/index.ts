import "reflect-metadata";

import { start } from "./server/server";

import { container } from "./config/di/di.container";
import { DIContainerModule } from "./inversify.config";

import settings from "./config/config";

async function runApp() {
    const app = await start(
        container,
        settings.server,
        settings.db,
        // settings.deepstream,
        DIContainerModule
    );
    return app;
}

(async () => {
    await runApp();
})();   

export { runApp };