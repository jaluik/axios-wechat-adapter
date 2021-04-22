import { AxiosAdapter, AxiosError } from 'axios';
import { methodProcessor, urlProcessor } from './utils';

const wechatAdapter: AxiosAdapter = (config) => {
  return new Promise((resolve, reject) => {
    const request = wx.request({
      url: urlProcessor(
        config.baseURL,
        config.url,
        config.params,
        config.paramsSerializer
      ),
      method: methodProcessor(config.method),
      timeout: config.timeout,
      success: (res) => {
        const response = {
          data: res.data,
          status: res.statusCode,
          statusText: res.errMsg,
          headers: res.header,
          config: config,
          request: request,
        };
        resolve(response);
      },
      fail: (res) => {
        const error = new Error(res.errMsg) as AxiosError;
        error.config = config;
        error.request = request;
        error.isAxiosError = true;
        reject(error);
      },
    });
  });
};

export default wechatAdapter;
