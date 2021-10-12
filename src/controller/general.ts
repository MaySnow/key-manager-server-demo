import { BaseContext } from "koa";
import { description, request, summary, tagsAll, query } from "koa-swagger-decorator";
import { CacheContainer } from "node-ts-cache";
import { MemoryStorage } from "node-ts-cache-storage-memory";
import { loggerInfo } from "../logger";
import InitVodClient from "../utils/VodClient";

const dkCache = new CacheContainer(new MemoryStorage());

interface KeyBaseContext extends BaseContext {
  query: {
    token: string,
    asset_id: string
  }; 
}

@tagsAll(["General"])
export default class GeneralController {

    @request("get", "/")
    @summary("Welcome page")
    @description("A simple welcome message to verify the service is up and running.")
    public static async helloWorld(ctx: BaseContext): Promise<void> {
      ctx.body = "Hello World!";
    }
    @request("get", "/hwcloud/api/get-key") 
    @summary("获取密钥接口")
    @description("")
    @query({
      token: { type: "string", required: true, description: "播放 url 带的 token，用于用户合法性校验" },
      asset_id: { type: "string", required: true, description: "播放 url 的媒资 ID" },
    })
    public static async getKey(ctx: KeyBaseContext): Promise<void> {
      const { token, asset_id } = ctx.query;
      try {
        let dk: any = await dkCache.getItem(asset_id);
        if (!dk) {
          if (!(/^aixuexi/.test(token))) {
            throw new Error(`token 校验失败 ${token}`);
          }
          const result: any = await InitVodClient.showAssetCipher(asset_id);
          if (!result.dk) {
            throw new Error(`获取 key 失败 ${JSON.stringify(result)}`);
          }
          dk = result.dk;
          // 缓存一分钟
          dkCache.setItem(asset_id, dk, {ttl: 60});
          loggerInfo(`[huaweiyun] 从华为云获取dk ${dk}`);
        } else {
          loggerInfo(`[huaweiyun] 从缓存获取dk ${dk}`);
        }
        ctx.set("Access-Control-Allow-Origin", "*");
        ctx.set("Content-Type", "application/octet-stream");
        ctx.body = Buffer.from(dk, "base64");
        return;
      } catch (e) {
        loggerInfo(`[huaweiyun] ${e}`);
        ctx.body = e.message;
      }
      ctx.status = 401;
      ctx.body = "获取 key 失败";
    }

}