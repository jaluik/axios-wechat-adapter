import { AxiosAdapter, Method } from 'axios';
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
  console.log('config', config);
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.url,
      method: methodProcessor(config.method),
      timeout: config.timeout,
    });
  });
};

export default wechatAdapter;
