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
  it('wx.request can request right url', () => {
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
});
