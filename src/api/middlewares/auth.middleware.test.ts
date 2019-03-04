import { Container } from "inversify";
import { container } from "../../config/di/di.container";
import { verifyToken } from "../../utils/jwt";
import { TYPES } from "../../config/constants/types";
import { UserRepository } from "../../config/interfaces/repositories";

function authMiddlewarFactoryTest(container: Container) {
    return () => {
        return (req, res, next) => {
            const _userRepo = container.get<UserRepository>(TYPES.UserRepository);

             (async () => {

                if (req.header('authorization')) {
                    const token = req.header('authorization');
                    console.log(">>>> token >>>>", token);

                    if (token) {
                        try {
                            const decoded = await verifyToken(token, 'elnady');
                            console.log(">>> decoded >>> ", decoded)
                            const userId = decoded.sub;

                            const user = await _userRepo.findById(userId);
                            if (!user) {
                                return res.json({
                                    success: false,
                                    msg: 'invalid_userId'
                                });
                            }

                            req.decoded = decoded;

                            next();

                        } catch (err) {
                            // invalid Token
                            return res.json({
                                success: false,
                                msg: 'invalid_token'
                            })

                        }
                    } else {
                        return res.json({
                            success: false,
                            msg: 'no_token'
                        })
                    }
                } else {
                    return res.json({
                        success: false,
                        msg: 'no_auth_header'
                    })
                }
               
                
            })();
        }
    }
} // end factoryTest


const authMiddleware = authMiddlewarFactoryTest(container);

export { authMiddleware };


