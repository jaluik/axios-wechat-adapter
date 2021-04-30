import axios, { AxiosAdapter, AxiosError } from 'axios';
import {
  methodProcessor,
  dataProcessor,
  urlProcessor,
  successResProcessor,
  failResProcessor,
} from './utils';

const wechatAdapter: AxiosAdapter = (config) => {
  return new Promise((resolve, reject) => {
    const request = () =>
      wx.request({
        url: urlProcessor(
          config.baseURL,
          config.url,
          config.params,
          config.paramsSerializer
        ),
        data: dataProcessor(config.data),
        method: methodProcessor(config.method),
        timeout: config.timeout,
        success: (res) => {
          successResProcessor(resolve, reject, res, config, request);
        },
        fail: (res) => {
          failResProcessor(reject, res, config, request);
        },
      });
    request();
  });
};

export default wechatAdapter;
