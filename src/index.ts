import { AxiosAdapter, Method, AxiosError } from 'axios';
import { WechatRequestMethod } from './global';

const methodProcessor = (axiosMethod: Method): WechatRequestMethod => {
  const upperCaseMethod = axiosMethod.toUpperCase();
  const repeatMethod = ['GET', 'PUT', 'DELETE', 'OPTIONS', 'POST'];
  if (repeatMethod.includes(upperCaseMethod)) {
    return upperCaseMethod as WechatRequestMethod;
  } else {
    throw new Error(`微信小程序暂不支持${axiosMethod}方法`);
  }
};

const wechatAdapter: AxiosAdapter = (config) => {
  return new Promise((resolve, reject) => {
    const request = wx.request({
      url: config.url,
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
