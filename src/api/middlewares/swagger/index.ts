import * as swaggerUi from "swagger-ui-express";
import { prepareDocs } from "../../../utils/swagger-ui-express";

export default { 
    serve: swaggerUi.serve,
    setup: swaggerUi.setup(prepareDocs('v1'))
}

