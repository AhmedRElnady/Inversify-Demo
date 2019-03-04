import { Container } from "inversify";
import * as passport  from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { container } from "../../config/di/di.container";

import { TYPES } from "../../config/constants/types";
import { UserRepository } from "../../config/interfaces/repositories";

function authMiddlewarFactoryTest(container: Container) {
    return () => {
        return (req, res, next) => {
            const _userRepo = container.get<UserRepository>(TYPES.UserRepository);

             (async () => {
                console.log('>>>> hi form auth middleware >>>>', _userRepo);
                
                const options = {
                    secretOrKey: 'elnady',
                    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
                    passReqToCallback: true
                }

                passport.use(new Strategy(options, async (payload, done)=> {
                    try {
                        // console.log(">>>> paylaod >>>>", payload);
                        // const user = await _userRepo.findById('5c23e1a2ce4d572db3864352');
                        const user = await _userRepo.findById('5c23e1a2ce4d572db3864352');
                        console.log(">>>> user >>>> ", user);
                        if (user === null) {

                            console.log(">>> not found");
                            return done(null, false, {msg: "user not found"});
                        }

                        console.log(">>>> user is >>>> ", user);
                        return done(null, user)

                    } catch (err) {
                        console.log(">>>> 5555555555 err");
                        return done(err, false);
                    }
                    
                    
                }));
                
                next();
                
            })();
        }
    }
} // end factoryTest


const authMiddleware = authMiddlewarFactoryTest(container);

export { authMiddleware };


