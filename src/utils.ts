import { Method, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { WechatRequestMethod } from './types';

export const isDate = (val?: any): boolean => {
  return toString.call(val) === '[object Date]';
};

export const isJSONstr = (str?: any): boolean => {
  try {
    return (
      typeof str === 'string' &&
      str.length &&
      (str = JSON.parse(str)) &&
      Object.prototype.toString.call(str) === '[object Object]'
    );
  } catch (error) {
    return false;
  }
};

export const encode = (val: string | number | boolean): string => {
  return encodeURIComponent(val)
    .replace(/%40/gi, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']');
};

/** 方法转换器 */
export const methodProcessor = (axiosMethod: Method): WechatRequestMethod => {
  const upperCaseMethod = axiosMethod.toUpperCase();
  const repeatMethod = ['GET', 'PUT', 'DELETE', 'OPTIONS', 'POST'];
  if (repeatMethod.includes(upperCaseMethod)) {
    return upperCaseMethod as WechatRequestMethod;
  } else {
    throw new Error(`微信小程序暂不支持${axiosMethod}方法`);
  }
};

/** url路径转换器 */
export const urlProcessor = (
  baseURL?: string,
  path?: string,
  params?: AxiosRequestConfig['params'],
  paramsSerializer?: AxiosRequestConfig['paramsSerializer']
): string => {
  let fullPath = /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(path)
    ? path
    : `${baseURL || ''}${path || ''}`;
  if (!params) {
    return fullPath;
  }
  const connector = fullPath.includes('?') ? '&' : '?';
  let serializedParam;
  if (paramsSerializer) {
    serializedParam = paramsSerializer(params);
    return `${fullPath}${connector}${serializedParam}`;
  }
  if (typeof params === 'string') {
    serializedParam = params;
  }
  if (typeof params === 'object') {
    serializedParam = Object.keys(params)
      .reduce((prev, key) => {
        const value = params[(key as unknown) as string];
        if (value === null || value === '') {
          return prev;
        }
        if (Array.isArray(value)) {
          value.forEach((item) => {
            prev.push(`${encode(key + '[]')}=${encode(item)}`);
          });
          return prev;
        }
        if (isDate(value)) {
          prev.push(`${encode(key)}=${encode(value.toISOString())}`);
          return prev;
        }
        if (typeof value === 'object') {
          prev.push(`${encode(key)}=${encode(value.toString())}`);
          return prev;
        }
        prev.push(`${encode(key)}=${encode(value)}`);
        return prev;
      }, [])
      .join('&');
  }
  return `${fullPath}${serializedParam ? connector : ''}${serializedParam}`;
};

export const dataProcessor = (data?: any) => {
  if (isJSONstr(data)) {
    return JSON.parse(data);
  }
  return data;
};

/** 正确返回处理器
 * 默认情况下 4xx、5xx请求在微信小程序中属于成功的返回
 * 因此这里需要对successResult做一次判断过滤
 *
 */
export const successResProcessor = (
  resolve: (val: AxiosResponse) => void,
  reject: (err: AxiosError) => void,
  res: any,
  config: AxiosRequestConfig,
  request: () => void
) => {
  const { data, statusCode, errMsg, header, ...restResult } = res;
  const response = {
    data: data,
    status: statusCode,
    statusText: errMsg,
    headers: header,
    config: config,
    request,
    ...restResult,
  };
  //保持和web逻辑一致
  if (config.validateStatus && !config.validateStatus(statusCode)) {
    const error = new Error(
      `Request failed with status code ${statusCode}`
    ) as AxiosError;
    error.config = config;
    error.request = request;
    error.response = response;
    error.isAxiosError = true;
    reject(error);
    return;
  }
  resolve(response);
};

/** 错误返回处理器 */
export const failResProcessor = (
  reject: (err: AxiosError) => void,
  res: any,
  config: AxiosRequestConfig,
  request: () => void
) => {
  const error = new Error(res.errMsg) as AxiosError;
  error.config = config;
  error.request = request;
  error.isAxiosError = true;
  reject(error);
};
