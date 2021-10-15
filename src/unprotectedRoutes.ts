import Router from "@koa/router";
import { general, HwCloudController } from "./controller";

const unprotectedRouter = new Router();

// Hello World route
unprotectedRouter.get("/", general.helloWorld);
unprotectedRouter.get("/hwcloud/api/get-key", HwCloudController.getKey);

export { unprotectedRouter };