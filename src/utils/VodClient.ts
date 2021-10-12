import core = require("@huaweicloud/huaweicloud-sdk-core");
import vod = require("@huaweicloud/huaweicloud-sdk-vod");
import { config } from "../config";
class InitVodClient {
   //初始化vod客户端
  vodClient: any;
  constructor() {
    const { ak, sk, projectId, endpoint } = config;
    const credentials: any = new core.BasicCredentials()
                     .withAk(ak)
                     .withSk(sk)
                     .withProjectId(projectId);
    // @ts-ignore: 第三方插件
    const VodClient: any = vod.VodClient;
    this.vodClient = VodClient.newBuilder()
                     .withCredential(credentials)
                     .withEndpoint(endpoint)
                     .build();
  }
  public showAssetCipher(assetId: string): Promise<void> {
    // @ts-ignore: 第三方插件
    const request = new vod.ShowAssetCipherRequest();
    request.assetId = assetId; 
    return new Promise((resolve, reject) => {
      // @ts-ignore: 第三方插件
      this.vodClient.showAssetCipher(request).then(result => {
        if (!result || !result.dk) {
          return reject(result);
        }
        resolve(result);
      }).catch((ex: any) => {
        reject(ex);
      });
    })
  }
}
export default new InitVodClient();