import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import { logger } from "./logger";
import { config } from "./config";
import { unprotectedRouter } from "./unprotectedRoutes";
import { protectedRouter } from "./protectedRoutes";

const app = new Koa();

 // Enable cors with default options
 app.use(cors());

 // Logger middleware -> use winston as logger (logging.ts with config)
 app.use(logger());

 // Enable bodyParser with default options
 app.use(bodyParser());

 // these routes are NOT protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
 app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());

  // These routes are protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
  app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});