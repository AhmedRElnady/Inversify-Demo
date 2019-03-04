import { ContainerModule } from "inversify";

// TYPES
import { TYPES } from "./config/constants/types";

// interfaces 
import { UserRepository as UserRepositoryInterface } from "./config/interfaces/repositories";
import { IDeapStreamService } from "./config/interfaces/services";
// Controllers 
import { UserController } from "./api/controllers/user.controller";

// Repositories concrete classes
import { UserRepository } from "./repository/user.repository";

// services (concrete classes)
import { DeepStreamService } from "./services/deepstream.service";
// Utils
import { registerController } from "../src/utils/di-container";

export const DIContainerModule = new ContainerModule((bind) => {
    // register controllers
    registerController(bind, UserController);

    // register repositories
    
    bind<UserRepositoryInterface>(TYPES.UserRepository).to(UserRepository).inSingletonScope(); 

    // register services 
    // bind<IDeapStreamService>(TYPES.DeapStreamService).to(DeepStreamService).inSingletonScope();

})