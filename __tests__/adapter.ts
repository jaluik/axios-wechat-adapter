import wechatAdapter from '../src/index';
import axios from 'axios';

axios.defaults.adapter = wechatAdapter;
const mockrequest = jest.fn();

describe('test adapter', () => {
  beforeAll(() => {
    (global as any).wx = {
      request: mockrequest,
    };
  });
  it('wx.request can return right result', () => {
    const promise = axios.get('www.url.com');
    mockrequest.mockImplementation(({ success }) => {
      success({
        data: 1,
        statusCode: 200,
      });
    });
    return expect(promise).resolves.toMatchObject({
      data: 1,
      status: 200,
    });
  });

  it('wx.request can return error result', () => {
    const promise = axios.get('www.url.com');
    mockrequest.mockImplementation(({ fail }) => {
      fail({
        errMsg: '请求失败',
      });
    });
    return expect(promise).rejects.toThrowError('请求失败');
  });

  it('wx.request can transform 4XX status code to error response', () => {
    const promise = axios.get('www.url.com');
    mockrequest.mockImplementation(({ success }) => {
      success({
        data: 1,
        statusCode: 401,
      });
    });
    return expect(promise).rejects.toThrowError(
      'Request failed with status code 401'
    );
  });
});
